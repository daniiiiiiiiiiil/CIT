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

WORKDIR /app

# Копируем собранные файлы
COPY --from=build /app/dist ./dist

# Устанавливаем простой HTTP сервер
RUN npm install -g serve

EXPOSE 5173

# Запускаем serve на порту 5173
CMD ["serve", "-s", "dist", "-l", "5173"]