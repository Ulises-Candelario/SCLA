# Docker para MySQL - Sistema de Control de Laboratorios y Aulas

Este contenedor Docker contiene la configuración para una base de datos MySQL utilizada en el Sistema de Control de Préstamo de Laboratorios y Aulas.

## Configuración

- La base de datos utilizada es `SCLA`.
- Las tablas incluyen: usuarios_estudiante, usuarios_docente, horarios_docente, reservacion_estudiante, reservacion_cambio_salon, historial_reservas.
- Se incluyen triggers, funciones, procedimientos almacenados y vistas.

## Cómo usar

1. Clonar este repositorio.
2. Navegar al directorio `docker_db`.
3. Ejecutar `docker-compose up` para iniciar el contenedor con la base de datos y ejecutar los scripts SQL automáticamente.
