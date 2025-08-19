import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import config from '../config/config';

const accessTokenOptions: SignOptions = {
    expiresIn: config.accessTokenExpiresIn as any,
};

const refreshTokenOptions: SignOptions = {
    expiresIn: config.refreshTokenExpiresIn as any,
};

interface TokenPayload extends JwtPayload {
    sub: string;
}

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({}, config.accessTokenSecret, {
        ...refreshTokenOptions,
        subject: userId,
    });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({}, config.refreshTokenSecret, {
        ...refreshTokenOptions,
        subject: userId,
    });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const payload = jwt.verify(token, config.accessTokenSecret) as TokenPayload;
    if (!payload.sub) throw new Error('Access token missing sub');
    return payload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    const payload = jwt.verify(token, config.refreshTokenSecret) as TokenPayload;
    if (!payload.sub) throw new Error('Refresh token missing sub');
    return payload;
};
