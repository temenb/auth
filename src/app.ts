import dotenv from 'dotenv';
import { AuthServiceService } from './generated/auth';
import * as grpc from '@grpc/grpc-js';
import * as authHandler from "./grpc/handlers/auth.handler";

dotenv.config();

const server = new grpc.Server();

server.addService(AuthServiceService, {
    register: authHandler.registerHandler,
});

export default server;
