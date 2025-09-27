import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as authService from '../../services/auth.service';
import {callbackError} from './callback.error';

export const register = async (
  call: grpc.ServerUnaryCall<AuthGrpc.RegisterRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  throw new Error('Registration is disabled');
  const {email, password} = call.request;

  try {
    await authService.createUser(email, password);

    const result = await authService.login(email, password);

    callback(null, result);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const anonymousSignIn = async (
  call: grpc.ServerUnaryCall<AuthGrpc.AnonymousSignInRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  try {
    const {deviceId} = call.request;
    const result = await authService.anonymousSignIn(deviceId);

    callback(null, result);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const login = async (
  call: grpc.ServerUnaryCall<AuthGrpc.LoginRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  throw new Error('Login is disabled');
  const {email, password} = call.request;

  try {
    const result = await authService.login(email, password);

    callback(null, result);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const refreshTokens = async (
  call: grpc.ServerUnaryCall<AuthGrpc.RefreshTokensRequest, AuthGrpc.AuthObject>,
  callback: grpc.sendUnaryData<AuthGrpc.AuthObject>
) => {
  const {token} = call.request;

  try {
    const response = await authService.refreshTokens(token);

    callback(null, response);

  } catch (err: any) {
    callbackError(callback, err);
  }
};

export const logout = async (
  call: grpc.ServerUnaryCall<AuthGrpc.LogoutRequest, AuthGrpc.LogoutResponse>,
  callback: grpc.sendUnaryData<AuthGrpc.LogoutResponse>
) => {
  const {userId} = call.request;

  try {
    const response = await authService.logout(userId);

    callback(null, response);

  } catch (err: any) {
    callbackError(callback, err);
  }
};
