import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import {initBoss} from '@shared/pg-boss';
import {startKafkaEventWorker} from '@shared/kafka';
import kafkaConfig from "./config/kafka.config";

const GRPC_PORT = process.env.GRPC_PORT ?? '50051';

async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Ошибка запуска gRPC:', err);
          reject(err);
          return;
        }
        logger.info(`🟢 gRPC сервер запущен на порту ${port}`);
        resolve();
      }
    );

    process.on('SIGINT', () => {
      logger.info('🛑 Остановка gRPC сервера...');
      grpcServer.forceShutdown();
      process.exit(0);
    });
  });
}

async function startPgBoss() {
  return new Promise<void>(() => {
    initBoss(() => new Promise<void>(() => {
      startKafkaEventWorker(kafkaConfig);
    }));
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc(), startPgBoss()]);
  } catch (err) {
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();

