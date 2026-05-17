FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Устанавливаем дополнительные инструменты если нужно
RUN apk add --no-cache postgresql-client

EXPOSE 3000

CMD ["sh", "-c", "echo 'Waiting for postgres...' && node server.js"]