import request from 'supertest';
import app from '../src/app'; // твой express app
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API', () => {
    let refreshToken: string;
    let accessToken: string;

    const testEmail = 'testuser@example.com';
    const testPassword = '123456';

    beforeAll(async () => {
        await prisma.user.deleteMany();
    });

    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: testEmail, password: testPassword });
        expect(res.statusCode).toBe(201);
        expect(res.body.email).toBe(testEmail);
    });

    it('should login user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testEmail, password: testPassword });

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    it('should get user p4rofile', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe(testEmail);
    });

    it('should refresh tokens', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken });

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    });
});
