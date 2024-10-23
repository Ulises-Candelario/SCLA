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
