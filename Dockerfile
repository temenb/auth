FROM node:22

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node jest.config.js ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node __tests__ ./__tests__

USER root

RUN apt-get update && apt-get install -y netcat-openbsd

#RUN npm ci
RUN npm i

RUN chown -R node:node /usr/src/app/node_modules\
    && mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app/dist

USER node

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3000 || exit 1
