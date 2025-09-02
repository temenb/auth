import {logger} from '@shared/logger';
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedUsers() {
  const users = await Promise.all(
    [...Array(100)].map(async (_, i) => ({
      id: `user-${i + 1}`,
      email: `test${i + 1}@test.com`,
      password: await bcrypt.hash('123123', 10),
    }))
  );

  await prisma.user.createMany({data: users});

  logger.log('👤 Users are created');
}
