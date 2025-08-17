import dotenv from 'dotenv';

dotenv.config();

export  const config = {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    rabbitmqUrl: process.env.RABBITMQ_URL || '',
    rabbitmqQueueUserCreated: process.env.RABBITMQ_QUEUE_USER_CREATED || '',
    port: process.env.PORT || 3000,
};

export default config;
