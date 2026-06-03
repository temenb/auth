import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as authService from '../../services/auth.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";

export const register = async (
  call: grpc.ServerUnaryCall<authGrpc.RegisterRequest, authGrpc.AuthObject>,
  callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
  throw new Error('Registration is disabled');
  const {email, password} = call.request;

  try {
    await authService.createUser(email, password);

    const result = await authService.login(email, password);

    callback(null, result);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const anonymousSignIn = async (
  call: grpc.ServerUnaryCall<authGrpc.AnonymousSignInRequest, authGrpc.AuthObject>,
  callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
  try {
    const {deviceId} = call.request;
    logger.log('anonymousSignIn ' + deviceId);
    const result = await authService.anonymousSignIn(deviceId);

    callback(null, result);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const login = async (
  call: grpc.ServerUnaryCall<authGrpc.LoginRequest, authGrpc.AuthObject>,
  callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
  throw new Error('Login is disabled');
  const {email, password} = call.request;

  try {
    const result = await authService.login(email, password);

    callback(null, result);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const refreshTokens = async (
  call: grpc.ServerUnaryCall<authGrpc.RefreshTokensRequest, authGrpc.AuthObject>,
  callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
  const {token} = call.request;

  try {
    const response = await authService.refreshTokens(token);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const logout = async (
  call: grpc.ServerUnaryCall<authGrpc.LogoutRequest, authGrpc.LogoutResponse>,
  callback: grpc.sendUnaryData<authGrpc.LogoutResponse>
) => {
  const {userId} = call.request;

  try {
    const response = await authService.logout(userId);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};
