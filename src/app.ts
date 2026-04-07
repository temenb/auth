import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import {startBoss} from './lib/pgBoss';
import { startUserCreatedWorker } from './workers/userCreated.worker';



async function startPgBoss() {
  await startBoss();
  await startUserCreatedWorker();
  console.log('PgBoss started');
}


const GRPC_PORT = process.env.GRPC_PORT ?? '50051';

async function startGrpc() {
  await     grpcServer.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        logger.error('❌ Ошибка запуска gRPC:', err);
        return;
      }
      logger.info(`🟢 gRPC сервер запущен на порту ${port}`);
    }
  )
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc()]);
    logger.info('🚀 Auth успешно запущен: gRPC');
  } catch (err) {
    logger.error('💥 Ошибка запуска Auth:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Завершение работы...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();

startGrpc().catch(err => {
  logger.error('❌ Ошибка запуска gRPC:', err);
});

startPgBoss().catch(err => {
  logger.error('Failed to start PgBoss', err);
});

