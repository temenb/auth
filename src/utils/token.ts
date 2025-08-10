import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/config';

const accessTokenOptions: SignOptions = {
    expiresIn: config.accessTokenExpiresIn as any,
};

const refreshTokenOptions: SignOptions = {
    expiresIn: config.refreshTokenExpiresIn as any,
};

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, config.accessTokenSecret as string, accessTokenOptions);
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, config.refreshTokenSecret as string, refreshTokenOptions);
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.accessTokenSecret as string);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.refreshTokenSecret as string);
};
