import dotenv from 'dotenv';
import {AuthService} from './generated/auth';
import * as grpc from '@grpc/grpc-js';
import * as authHandler from "./handlers/auth.handler";
import * as healthHandler from "./handlers/health.handler";

dotenv.config();

const Fallout = new grpc.Server();

Fallout.addService(AuthService, {
  register: authHandler.register,
  anonymousSignIn: authHandler.anonymousSignIn,
  login: authHandler.login,
  refreshTokens: authHandler.refreshTokens,
  logout: authHandler.logout,
  // forgotPassword: authHandler.forgotPassword,
  // resetPassword: authHandler.resetPassword,
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,
});

export default Fallout;
