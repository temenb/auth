import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../utils/token';

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await prisma.user.findUnique({ where: { googleId: profile.id } });

    if (existingUser) {
        const newAccessToken = generateAccessToken(existingUser.id);
        const newRefreshToken = generateRefreshToken(existingUser.id);
        await prisma.user.update({ where: { id: existingUser.id }, data: { refreshToken: newRefreshToken } });
        return done(null, { accessToken: newAccessToken, refreshToken: newRefreshToken });
    }

    const newUser = await prisma.user.create({
        data: {
            email: profile.emails?.[0].value!,
            googleId: profile.id,
            refreshToken: generateRefreshToken(0), // временный, можно null или сразу актуальный
        },
    });

    const newAccessToken = generateAccessToken(newUser.id);
    const newRefreshToken = generateRefreshToken(newUser.id);
    await prisma.user.update({ where: { id: newUser.id }, data: { refreshToken: newRefreshToken } });

    return done(null, { accessToken: newAccessToken, refreshToken: newRefreshToken });
}));
