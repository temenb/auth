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

  // Создаём пользователей только если их ещё нет
  for (const user of users) {
    const exists = await prisma.user.findUnique({where: {id: user.id}});
    if (!exists) {
      await prisma.user.create({data: user});
    }
  }

  logger.log('👤 Users are created');
}
