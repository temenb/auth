import logger from "../utils/logger";
import amqp from 'amqplib';
import prisma from '../utils/prisma';
import config from '../config/config';

const startedAt = Date.now();

export const health = async () => {
  const [pgOk, rabbitOk] = await Promise.all([
    checkPostgres(),
    checkRabbit(),
  ]);

  return {
    healthy: pgOk && rabbitOk,
    components: {
      postgres: pgOk ? 'ok' : 'fail',
      rabbitmq: rabbitOk ? 'ok' : 'fail',
    },
  };
};

export const status = async () => {
  return {
    name: 'gateway',
    version: process.env.BUILD_VERSION || 'dev',
    env: process.env.NODE_ENV || 'development',
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  };
};

export const livez = async () => {
  return {
    live: true,
  };
};

export const readyz = async () => {
  const [pgOk, rabbitOk] = await Promise.all([
    checkPostgres(),
    checkRabbit(),
  ]);

  return {ready: pgOk && rabbitOk};
};

export const checkPostgres = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    console.error('❌ Prisma/Postgres health check failed:', err);
    return false;
  }
};

export const checkRabbit = async (): Promise<boolean> => {
  try {
    const conn = await amqp.connect(config.rabbitmqUrl);
    const channel = await conn.createChannel();

    await channel.assertQueue(config.rabbitmqQueueUserCreated, { durable: true });
    await channel.close();
    await conn.close();
    return true;
  } catch (err) {
    logger.error('❌ RabbitMQ health check failed:', err);
    return false;
  }
};
