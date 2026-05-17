# client/Dockerfile
FROM node:18-alpine AS build

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
FROM nginx:alpine

# Копируем собранные файлы из этапа build
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]