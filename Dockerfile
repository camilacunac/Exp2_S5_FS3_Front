# Etapa 1: Dependencias de desarrollo
FROM node:18.19.1-alpine AS dev-deps

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos relacionados con las dependencias para aprovechar la cache
COPY package.json package-lock.json ./

# Instala solo las dependencias (utilizando cache y excluyendo logs innecesarios)
RUN npm ci --quiet

# Etapa 2: Construcción
FROM node:18.19.1-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias desde la etapa anterior
COPY --from=dev-deps /app/node_modules ./node_modules

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación (se asume que tienes un script build en package.json)
RUN npm run build

# Etapa 3: Producción
FROM nginx:1.23.3 AS prod

# Expone el puerto 80
EXPOSE 80

# Copia los archivos generados en la construcción al directorio de Nginx
COPY --from=builder /app/dist/perfum-store/browser/ /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Comando para iniciar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
