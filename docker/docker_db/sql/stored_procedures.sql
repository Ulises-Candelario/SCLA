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

-- Store procedure que devuelve la cantidad de veces que un salon fue reservado en un rango de fechas , recibe parametro el aula y las fechas

DELIMITER $$

CREATE PROCEDURE ConteoReservasAulaPorFechas(
    IN p_aula_id INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT COUNT(*) AS total_reservas
    FROM reservacion_estudiante
    WHERE aula_id = p_aula_id
    AND fecha_reserva BETWEEN p_fecha_inicio AND p_fecha_fin;
END $$

DELIMITER ;