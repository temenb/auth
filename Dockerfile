FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app/

COPY shared/logger/ ./shared/logger/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/auth/package*.json ./services/auth/
COPY services/auth/jest.config.js ./services/auth/
COPY services/auth/tsconfig.json ./services/auth/
COPY services/auth/src ./services/auth/src/
COPY services/auth/prisma ./services/auth/prisma/
COPY services/auth/__tests__ ./services/auth/__tests__/

USER root

RUN corepack enable && pnpm install
RUN chown -R node:node /usr/src/app

USER node

RUN pnpm --filter @shared/logger build
RUN pnpm --filter auth build
RUN pnpm --filter auth prisma:generate

EXPOSE 3000

CMD ["pnpm", "--filter", "auth", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
