FROM node:22
ENV NODE_ENV=development

WORKDIR /usr/src/app/

COPY shared/ ./shared/
COPY turbo.json  ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/auth/package*.json ./services/auth/
COPY services/auth/jest.config.js ./services/auth/
COPY services/auth/tsconfig.json ./services/auth/
COPY services/auth/src ./services/auth/src/
COPY services/auth/prisma ./services/auth/prisma/
COPY services/auth/__tests__ ./services/auth/__tests__/
COPY services/auth/.env ./services/auth/.env

USER root

RUN apt-get clean && \
    mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y netcat-openbsd

RUN corepack enable && pnpm install
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

RUN rm -Rf ./shared/logger/
#RUN rm services/auth/.env


CMD ["pnpm", "--filter", "auth", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1
