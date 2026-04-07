import {prisma} from '../lib/prisma';
import bcrypt from 'bcrypt';
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from '../lib/token';
import {randomUUID} from 'crypto';
import {enqueueEventTx} from '../lib/pgBoss';


export const createUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({where: {email}});
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);


  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {email, password: hashedPassword},
    });

    enqueueEventTx(tx, 'user.created', { userId: user.id });

    return user;

  });

};

export const anonymousSignIn = async (deviceId: string) => {
  let device = await prisma.device.findUnique({
    where: { deviceId },
    include: { user: true },
  });

  let user;

  if (!device) {
    user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: randomUUID(),
          devices: {
            create: { deviceId },
          },
        },
      });

      await enqueueEventTx(tx, 'user.created', { userId: newUser.id });

      return newUser;
    });
  } else {
    user = device.user;
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.session.create({
    data: {
      userId: user.id,
      accessToken,
      refreshToken,
    },
  });


  return { accessToken, refreshToken, userId: user.id };
};

export const login = async (email: string, password: string) => {
  // ищем пользователя по email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw new Error('Invalid credentials');
  }

  // проверяем пароль
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // генерируем токены
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // создаём новую сессию
  await prisma.session.create({
    data: {
      userId: user.id,
      accessToken,
      refreshToken,
    },
  });

  return { accessToken, refreshToken, userId: user.id };
};

export const refreshTokens = async (token: string) => {
  const decoded = verifyRefreshToken(token) as any;

  // ищем сессию по refreshToken
  const session = await prisma.session.findUnique({
    where: { refreshToken: token },
    include: { user: true },
  });

  if (!session || !session.user || session.user.id !== decoded.userId) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(session.user.id);
  const newRefreshToken = generateRefreshToken(session.user.id);

  // обновляем сессию
  await prisma.session.update({
    where: { id: session.id },
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    userId: session.user.id,
  };
};

export const logout = async (userId: string) => {
  // удаляем все сессии пользователя
  await prisma.session.deleteMany({
    where: { userId },
  });

  return {
    success: true,
    message: 'Logged out successfully',
  };
};


export const forgotPassword = async (userId: string) => {
  // await prisma.user.update({
  //     where: { id: userId },
  //     data: { refreshToken: null },
  // });
};

export const resetPassword = async (userId: string) => {
  // await prisma.user.update({
  //     where: { id: userId },
  //     data: { refreshToken: null },
  // });
};


