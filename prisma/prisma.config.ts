import { defineConfig } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  datasource: {
    db: {
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      }),
    },
  },
});
