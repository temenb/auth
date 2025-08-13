import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../../generated/auth';
import * as authService from '../../services/auth.service';
import {Request, Response} from "express";
import {createUser} from "../../services/auth.service";

export const register = async (
    call: grpc.ServerUnaryCall<AuthGrpc.RegisterRequest, AuthGrpc.AuthResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.AuthResponse>
) => {
    const { email, password } = call.request;

    try {
        await authService.createUser(email, password);

        const result = await authService.login(email, password);

        callback(null, {
            accessToken: result.accessToken?? '',
            refreshToken: result.refreshToken?? '',
            userId: result.userId,
        });

    } catch (err: any) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};

export const login = async (
    call: grpc.ServerUnaryCall<AuthGrpc.LoginRequest, AuthGrpc.AuthResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.AuthResponse>
) => {
    const { email, password } = call.request;

    try {
        const result = await authService.login(email, password);

        callback(null, {
            accessToken: result.accessToken?? '',
            refreshToken: result.refreshToken?? '',
            userId: result.userId,
        });

    } catch (err: any) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};

export const refreshTokens = async (
    call: grpc.ServerUnaryCall<AuthGrpc.RefreshTokensRequest, AuthGrpc.RefreshTokensResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.RefreshTokensResponse>
) => {
    const { token } = call.request;

    try {
        const tokens = await authService.refreshTokens(token);

        callback(null, {
            accessToken: tokens.accessToken?? '',
            refreshToken: tokens.refreshToken?? '',
        });

    } catch (err: any) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};

export const logout = async (
    call: grpc.ServerUnaryCall<AuthGrpc.LogoutRequest, AuthGrpc.LogoutResponse>,
    callback: grpc.sendUnaryData<AuthGrpc.LogoutResponse>
) => {
    const { userId } = call.request;

    try {
        await authService.logout(userId);

        callback(null, {
            success: true,
            message: 'Logged out successfully',
        });

    } catch (err: any) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};
