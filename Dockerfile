FROM node:22

WORKDIR /usr/src/app

COPY --chown=node:node services/auth/package*.json ./
COPY --chown=node:node services/auth/jest.config.js ./
COPY --chown=node:node services/auth/tsconfig.json ./
COPY --chown=node:node services/auth/src ./src
COPY --chown=node:node services/auth/prisma ./prisma
COPY --chown=node:node services/auth/__tests__ ./__tests__

USER root

RUN apt-get update && apt-get install -y netcat-openbsd

RUN #npm install -g pnpm && pnpm install --frozen-lockfile
RUN npm install -g pnpm && pnpm install

RUN chown -R node:node /usr/src/app/node_modules\
    && mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app/dist

USER node

RUN npx prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1
