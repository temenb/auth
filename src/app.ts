import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';
import pgBossManager from '@shared/pg-boss-manager';
import kafkaConfig, {kafkaProducersConfig} from "./config/kafka.config";
import config from "./config/config";
import pgBossConfig from "./config/pg.boss.config";

async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${config.grpcPort}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Failed to start gRPC:', err);
          reject(err);
          return;
        }
        logger.info(`🟢 gRPC server started on port ${port}`);
        resolve();
      }
    );

    process.on('SIGINT', () => {
      logger.info('🛑 Stopping gRPC server...');
      grpcServer.forceShutdown();
      process.exit(0);
    });
  });
}

async function startPgBoss() {
  await pgBossManager.initBoss(pgBossConfig, async () => {
    for (const topicConfig of Object.values(kafkaProducersConfig)) {
      await pgBossManager.startKafkaWorker(kafkaConfig, topicConfig);
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
    logger.info('🛑 Shutting down...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();












