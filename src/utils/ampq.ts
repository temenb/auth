import amqp, {ChannelModel} from 'amqplib';
import config from '../config/config';
import logger from './logger';

let connection: amqp.ChannelModel;
const channels: Record<string, amqp.Channel> = {};

export async function connectWithRetry(): Promise<amqp.ChannelModel> {
  if (connection) {
    return connection;
  }

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      connection = await amqp.connect(config.rabbitmqUrl);
      logger.log('✅ Connected to RabbitMQ');
      return connection;
    } catch (err) {
      logger.log(`⏳ RabbitMQ not ready, retrying (${i + 1}/${maxRetries})...`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  throw new Error('❌ RabbitMQ connection failed after retries');
}

export async function getChannel(queueName: string): Promise<amqp.Channel> {
  if (channels[queueName]) {
    return channels[queueName];
  }

  if (!connection) {
    connection = await connectWithRetry();
    if (!connection) {
      throw new Error('RabbitMQ connection not initialized');
    }
  }

  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);
  channels[queueName] = channel;
  return channel;
}

export async function initChannels(queueNames: string[]): Promise<void> {
  for (const name of queueNames) {
    await getChannel(name);
  }
}

const shutdown = async () => {
  logger.log('🛑 Graceful shutdown...');
  for (const ch of Object.values(channels)) {
    await ch.close().catch(err => logger.error(`⚠️ Error closing channel: ${err}`));
  }
  if (connection) {
    await connection.close().catch(err => logger.error(`⚠️ Error closing connection: ${err}`));
    logger.log('✅ RabbitMQ connection closed');
  }
  process.exit(0);
};

export async function publishToQueue(event: string, payload: any) {
  const channel = await getChannel(event);

  channel.sendToQueue(event, Buffer.from(JSON.stringify(payload)));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', async err => {
  logger.error('❌ Uncaught exception:', err);
  await shutdown();
});
