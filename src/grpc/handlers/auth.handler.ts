import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../../generated/auth';
import * as authService from '../../services/auth.service';
import * as heathService from '../../services/health.service';

export const callbackError = (callback: grpc.sendUnaryData<any>, err: unknown) => {
    const message = err instanceof Error ? err.message : 'Unknown error';
    callback({ code: grpc.status.INTERNAL, message }, null);
};

export const register = async (
    call: grpc.ServerUnaryCall<AuthGrpc.RegisterRequest, AuthGrpc.AuthResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.AuthResponse>
) => {
    throw new Error('Registration is disabled');
    const { email, password } = call.request;

    try {
        await authService.createUser(email, password);

        const result = await authService.login(email, password);

        callback(null, result);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const anonymousSignIn = async (
    call: grpc.ServerUnaryCall<AuthGrpc.Empty, AuthGrpc.AuthResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.AuthResponse>
) => {
    try {
        const result = await authService.anonymousSignIn();

        callback(null, result);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const login = async (
    call: grpc.ServerUnaryCall<AuthGrpc.LoginRequest, AuthGrpc.AuthResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.AuthResponse>
) => {
    throw new Error('Login is disabled');
    const { email, password } = call.request;

    try {
        const result = await authService.login(email, password);

        callback(null, result);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const refreshTokens = async (
    call: grpc.ServerUnaryCall<AuthGrpc.RefreshTokensRequest, AuthGrpc.AuthResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.AuthResponse>
) => {
    const { token } = call.request;

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
    const { userId } = call.request;

    try {
        const response = await authService.logout(userId);

        callback(null, response);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const health = async (
    call: grpc.ServerUnaryCall<AuthGrpc.Empty, AuthGrpc.HealthReport>,
    callback: grpc.sendUnaryData<AuthGrpc.HealthReport>
) => {
    try {
        const response = await heathService.health();

        callback(null, response);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const status = async (
  call: grpc.ServerUnaryCall<AuthGrpc.Empty, AuthGrpc.StatusInfo>,
  callback: grpc.sendUnaryData<AuthGrpc.StatusInfo>
) => {
    try {
        const response = await heathService.status();

        callback(null, response);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const livez = async (
  call: grpc.ServerUnaryCall<AuthGrpc.Empty, AuthGrpc.LiveStatus>,
  callback: grpc.sendUnaryData<AuthGrpc.LiveStatus>
) => {
    try {
        const response = await heathService.livez();

        callback(null, response);

    } catch (err: any) {
        callbackError(callback, err);
    }
};

export const readyz = async (
  call: grpc.ServerUnaryCall<AuthGrpc.Empty, AuthGrpc.ReadyStatus>,
  callback: grpc.sendUnaryData<AuthGrpc.ReadyStatus>
) => {
    try {
        const response = await heathService.readyz();

        callback(null, response);

    } catch (err: any) {
        callbackError(callback, err);
    }
};
