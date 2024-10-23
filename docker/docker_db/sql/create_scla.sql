CREATE DATABASE IF NOT EXISTS SCLA;

USE SCLA;

-- Tabla de aulas y laboratorios (crear primero)
CREATE TABLE IF NOT EXISTS aulas_laboratorios (
  id_lugar INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('aula', 'laboratorio'),  -- Indica si es aula o laboratorio
  nombre_numero VARCHAR(100),  -- Nombre o número del aula/laboratorio
  ubicacion ENUM('planta alta', 'planta baja')  -- Ubicación del aula/laboratorio
);

-- Tabla para los estudiantes
CREATE TABLE IF NOT EXISTS usuarios_estudiante (
  id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  n_cuenta VARCHAR(50) UNIQUE,  -- Número de cuenta del estudiante
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)  -- Contraseña
);

-- Tabla para los docentes
CREATE TABLE IF NOT EXISTS usuarios_docente (
  id_docente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)  -- Contraseña
);

-- Tabla de horarios de los docentes
CREATE TABLE IF NOT EXISTS horarios_docente (
  id_horario INT AUTO_INCREMENT PRIMARY KEY,
  docente_id INT,
  dia_semana VARCHAR(20),
  hora_inicio TIME,
  hora_fin TIME,
  aula VARCHAR(50),  -- Añadido para indicar en qué aula/laboratorio tiene la clase
  FOREIGN KEY (docente_id) REFERENCES usuarios_docente(id_docente)
);

-- Tabla de reservaciones de estudiantes
CREATE TABLE IF NOT EXISTS reservacion_estudiante (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT,
  fecha_reserva DATE,
  aula_id INT,  -- Añadido para referenciar el aula o laboratorio
  hora_inicio TIME,
  hora_fin TIME,
  FOREIGN KEY (estudiante_id) REFERENCES usuarios_estudiante(id_estudiante),
  FOREIGN KEY (aula_id) REFERENCES aulas_laboratorios(id_lugar)  -- Referencia a la tabla de aulas/laboratorios
);

-- Tabla de cambio de salón para docentes
CREATE TABLE IF NOT EXISTS reservacion_cambio_salon (
  id_cambio INT AUTO_INCREMENT PRIMARY KEY,
  docente_id INT,
  fecha_cambio DATE,
  aula_antigua VARCHAR(50),
  aula_nueva VARCHAR(50),
  hora_inicio TIME,
  hora_fin TIME,
  FOREIGN KEY (docente_id) REFERENCES usuarios_docente(id_docente)
);

-- Tabla de historial de reservas
CREATE TABLE IF NOT EXISTS historial_reservas (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  tipo_usuario ENUM('estudiante', 'docente'),
  fecha_reserva DATE,
  accion VARCHAR(50)
);

-- Modificar la tabla de horarios_docente para eliminar en cascada
ALTER TABLE horarios_docente 
ADD CONSTRAINT fk_docente_horarios
FOREIGN KEY (docente_id) REFERENCES usuarios_docente(id_docente)
ON DELETE CASCADE;

-- Modificar la tabla de reservacion_estudiante para eliminar en cascada
ALTER TABLE reservacion_estudiante 
ADD CONSTRAINT fk_estudiante_reserva
FOREIGN KEY (estudiante_id) REFERENCES usuarios_estudiante(id_estudiante)
ON DELETE CASCADE;

-- Modificar la tabla de reservacion_cambio_salon para eliminar en cascada
ALTER TABLE reservacion_cambio_salon 
ADD CONSTRAINT fk_docente_cambio_salon
FOREIGN KEY (docente_id) REFERENCES usuarios_docente(id_docente)
ON DELETE CASCADE;
