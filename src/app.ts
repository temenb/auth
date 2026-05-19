import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import {initBoss, startWorker} from '@shared/pg-boss';
import kafkaConfig, {kafkaProducersConfig} from "./config/kafka.config";
import config from "./config/config";

async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${config.grpcPort}`,
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
  await initBoss(async () => {
    for (const topicConfig of Object.values(kafkaProducersConfig)) {
      await startWorker(kafkaConfig, topicConfig);
    }
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

