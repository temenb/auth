import {PrismaClient} from '@prisma/client';
import {createProducer} from "@shared/kafka";
import kafkaConfig, {createUserProducerConfig} from "../config/kafka.config";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);

  if (params.model === 'user' && params.action === 'create') {
    console.log('User created:', result);
    // здесь можно отправить событие в Kafka
    const producer = await createProducer(kafkaConfig);
    producer.send(createUserProducerConfig, [{value: JSON.stringify({ownerId: params.model.id})}]);

  }

  return result;
});


export default prisma;
