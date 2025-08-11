import amqp from 'amqplib';

export async function publishToQueue(event: string, payload: any) {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await conn.createChannel();
    await channel.assertQueue(event, { durable: true });
    channel.sendToQueue(event, Buffer.from(JSON.stringify(payload)));
}