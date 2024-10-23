# Usar la imagen oficial de Node.js
FROM node:18

# Crear un directorio de trabajo para el backend en el contenedor
WORKDIR /usr/src/app/backend

# Copiar el package.json y package-lock.json desde el directorio backend al directorio de trabajo
COPY ./backend/package.json ./backend/package-lock.json ./

# Instalar las dependencias del backend
RUN npm install

# Copiar todos los archivos del backend al contenedor
COPY ./backend/ ./

# Exponer el puerto 3000 para el backend
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]
