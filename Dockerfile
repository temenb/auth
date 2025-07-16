FROM node:22

# Рабочая директория
WORKDIR /usr/src/app

# Копируем только package*.json для npm install с кэшированием
COPY --chown=node:node package*.json ./

# Устанавливаем зависимости от root, чтобы избежать проблем с правами
USER root
RUN npm install

# Копируем остальные файлы
COPY --chown=node:node . .

# Создаём директорию dist с нужными правами
RUN mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app/dist

# Билдим проект от пользователя node
USER node
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запуск
CMD ["npm", "start"]
