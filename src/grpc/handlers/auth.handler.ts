import * as grpc from '@grpc/grpc-js';
import {RegisterRequest, AuthResponse, AuthServiceService} from '../../generated/auth';
import * as authService from '../../services/auth.service';

export const registerHandler = async (
    call: grpc.ServerUnaryCall<RegisterRequest, AuthResponse>,
    callback: grpc.sendUnaryData<AuthResponse>
) => {
    const { email, password } = call.request;

    try {
        const result = await authService.register(email, password);

        console.log(result);
        callback(null, {
            accessToken: result.accessToken?? '',
            refreshToken: result.refreshToken?? '',
            userId: String(result.id),
        });

    } catch (err: any) {
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        }, null);
    }
};
