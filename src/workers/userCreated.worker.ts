// src/workers/userCreated.worker.ts
import { boss } from '../lib/pgBoss';
import { getProducer } from '../kafka/producer';

export const startUserCreatedWorker = async () => {
  const producer = await getProducer();

  await boss.work(
    'user.created',
    { teamSize: 1, batchSize: 10 }, // можно увеличить
    async (jobs) => {
      const messages = jobs.map((job) => ({
        value: JSON.stringify(job.data),
      }));

      await producer.send({
        topic: 'user.created',
        messages,
      });
    }
  );
};