USE SCLA;

-- Vista para administradores, muestra las reservas de estudiantes
CREATE VIEW vista_reservas_admin AS
SELECT 
  r.id_reserva,
  u.nombre AS estudiante_nombre,
  r.fecha_reserva,
  a.nombre_numero AS aula_laboratorio,
  r.hora_inicio,
  r.hora_fin
FROM reservacion_estudiante r
JOIN usuarios_estudiante u ON r.estudiante_id = u.id_estudiante
JOIN aulas_laboratorios a ON r.aula_id = a.id_lugar;

-- Vista para admin, muestra el horario del docente y en que aula 

CREATE VIEW vista_horario_docente_salon AS
SELECT 

    D.apellido AS Apellido,
    D.email AS correo,
    H.dia_semana AS Dia,
    H.hora_inicio AS Hora_Inicio,
    H.hora_fin AS Hora_Fin,
    H.aula AS Aula
FROM 
    usuarios_docente D
JOIN 
    horarios_docente H ON d.id_docente = h.docente_id;

-- Muestra los alumnos con mas reservas 

CREATE VIEW vista_Cantidad_reservas AS
SELECT 
    e.nombre AS nombre_estudiante,
    e.apellido AS apellido_estudiante,
    COUNT(r.id_reserva) AS total_reservas
FROM 
    usuarios_estudiante e
JOIN 
    reservacion_estudiante r ON e.id_estudiante = r.estudiante_id
GROUP BY 
    e.id_estudiante, e.nombre, e.apellido
ORDER BY 
    total_reservas DESC;

-- Vista para ver en orden las aulas mas reservadas

CREATE VIEW vista_aula_mas_reservada AS
SELECT 
    a.nombre_numero AS aula_laboratorio,
    COUNT(r.id_reserva) AS total_reservas
FROM 
    aulas_laboratorios a
JOIN 
    reservacion_estudiante r ON a.id_lugar = r.aula_id
GROUP BY 
    a.id_lugar, a.nombre_numero
ORDER BY 
    total_reservas DESC;


CREATE VIEW vista_dias_mas_reservas AS
SELECT 
    h.dia_semana,
    COUNT(r.id_reserva) AS total_reservas
FROM 
    horarios_docente h
JOIN 
    reservacion_estudiante r ON h.aula = r.aula_id
GROUP BY 
    h.dia_semana
ORDER BY 
    total_reservas DESC;

-- Vista que muestra los dias de la semana mas solicitados en reservas

CREATE VIEW visa_dia_mas_solicitado AS
SELECT 
    h.dia_semana,
    COUNT(r.id_reserva) AS total_reservas
FROM 
    horarios_docente h
JOIN 
    reservacion_estudiante r ON h.aula = r.aula_id
GROUP BY 
    h.dia_semana
ORDER BY 
    total_reservas DESC;

