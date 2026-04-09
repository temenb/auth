import { Prisma } from '@prisma/client';
import logger from "@shared/logger";

export async function enqueueEventTx(
  tx: Prisma.TransactionClient,
  topic: string,
  data: object
): Promise<string | undefined> {
  const jobName = `event.${topic}`;




  // logger.log(jobName);
  const result = await tx.$queryRaw<{ send: string }[]>`
      insert into pgboss.job (name, data)
      values (${jobName}, ${JSON.stringify(data)}::jsonb)
  `;

  return result[0]?.send;
}



