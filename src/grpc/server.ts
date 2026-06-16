import {AuthService} from './generated/auth';
import * as grpc from '@grpc/grpc-js';
import * as authHandler from "./handlers/auth.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(AuthService, {
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,

  register: authHandler.register,
  anonymousSignIn: authHandler.anonymousSignIn,
  getUser: authHandler.getUser,
  login: authHandler.login,
  refreshTokens: authHandler.refreshTokens,
  logout: authHandler.logout,
  // forgotPassword: authHandler.forgotPassword,
  // resetPassword: authHandler.resetPassword,
});

export default server;
