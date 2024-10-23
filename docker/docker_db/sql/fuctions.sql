USE SCLA;

DELIMITER //
CREATE FUNCTION verificar_disponibilidad(aula_id INT, fecha DATE, hora_inicio TIME, hora_fin TIME)
RETURNS BOOLEAN
READS SQL DATA
BEGIN
  DECLARE disponible BOOLEAN DEFAULT TRUE;

  IF EXISTS (
    SELECT 1 FROM reservacion_estudiante
    WHERE aula_id = aula_id AND fecha_reserva = fecha
    AND ((hora_inicio BETWEEN hora_inicio AND hora_fin) OR (hora_fin BETWEEN hora_inicio AND hora_fin))
  ) THEN
    SET disponible = FALSE;
  END IF;

  RETURN disponible;
END;
//
DELIMITER ;
