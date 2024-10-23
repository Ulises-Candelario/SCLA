USE SCLA;

DELIMITER //
CREATE PROCEDURE crear_reserva_estudiante(
    IN estudiante_id INT, 
    IN fecha_reserva DATE, 
    IN aula_id INT, 
    IN hora_inicio TIME, 
    IN hora_fin TIME)
BEGIN
    IF verificar_disponibilidad(aula_id, fecha_reserva, hora_inicio, hora_fin) THEN
        INSERT INTO reservacion_estudiante (estudiante_id, fecha_reserva, aula_id, hora_inicio, hora_fin)
        VALUES (estudiante_id, fecha_reserva, aula_id, hora_inicio, hora_fin);
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El aula o laboratorio no está disponible en el horario solicitado';
    END IF;
END;
//
DELIMITER ;
