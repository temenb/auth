import amqp from 'amqplib';
import config from '../config/config';

export async function publishToQueue(event: string, payload: any) {
    const conn = await amqp.connect(config.rabbitmqUrl!);
    const channel = await conn.createChannel();
    await channel.assertQueue(event, { durable: true });
    channel.sendToQueue(event, Buffer.from(JSON.stringify(payload)));
}