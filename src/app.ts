import dotenv from 'dotenv';
import { AuthService } from './generated/auth';
import * as grpc from '@grpc/grpc-js';
import * as authHandler from "./grpc/handlers/auth.handler";
import {initKafka} from "./utils/kafka";
import config from "./config/config";

dotenv.config();

const server = new grpc.Server();

server.addService(AuthService, {
    register: authHandler.register,
    login: authHandler.login,
    refreshTokens: authHandler.refreshTokens,
    logout: authHandler.logout,
    // forgotPassword: authHandler.forgotPassword,
    // resetPassword: authHandler.resetPassword,
    health: authHandler.health,
    status: authHandler.status,
    livez: authHandler.livez,
    readyz: authHandler.readyz,
});

initKafka(config.kafkaClientId);

export default server;

