# Etapa de compilación
FROM node:18.19.1 AS dev-deps

WORKDIR /app

COPY package.json package.json

RUN npm install

#Etapa 2
FROM node:18.19.1 AS builder

WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

#Etapa de producción
FROM nginx:1.23.3 AS prod
EXPOSE 80

COPY --from=builder /app/dist/perfum-store/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]