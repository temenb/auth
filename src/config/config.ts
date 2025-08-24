import dotenv from 'dotenv';

dotenv.config();

export  const config = {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    kafkaBrokers: process.env.KAFKA_BROKERS || 'kafka:9092',
    kafkaTopicUserCreated: process.env.KAFKA_TOPIC_USER_CREATED || 'user.created',
    kafkaClientId: process.env.KAFKA_CLIENT_ID || 'user-producer',
    port: process.env.PORT || 3000,
};

export default config;
