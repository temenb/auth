import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`);
});
