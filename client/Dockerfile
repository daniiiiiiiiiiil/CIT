# Измените с node:18-alpine на node:20-alpine или node:22-alpine
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Продакшн этап
FROM node:20-alpine
RUN npm install -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 4173
CMD ["serve", "-s", "/app/dist", "-l", "4173"]