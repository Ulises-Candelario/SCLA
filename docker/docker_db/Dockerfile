# Usar la imagen oficial de MySQL
FROM mysql:8.0

# Definir variables de entorno
ENV MYSQL_DATABASE=SCLA
ENV MYSQL_ROOT_PASSWORD=rootpassword

# Copiar los archivos SQL dentro del contenedor para su ejecución
COPY ./sql /docker-entrypoint-initdb.d/
