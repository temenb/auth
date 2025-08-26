import * as authService from '../services/auth.service';
import { logger } from '@shared/logger';

export async function seedUsers() {
    // const existing = await db.user.findMany();
    // if (existing.length > 0) return;

    for (let i= 0; i < 100; i++) {
        await authService.createUser(`test${i}@test.com`, '123123');
    }
    logger.log('👤 Users are created');
}

