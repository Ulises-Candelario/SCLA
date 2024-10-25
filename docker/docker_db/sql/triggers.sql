USE SCLA;

-- Trigger para eliminar en cascada cuando se elimina un estudiante
DELIMITER //
CREATE TRIGGER before_delete_estudiante
BEFORE DELETE ON usuarios_estudiante
FOR EACH ROW
BEGIN
  DELETE FROM reservacion_estudiante WHERE estudiante_id = OLD.id_estudiante;
END;
//

-- Trigger para eliminar en cascada cuando se elimina un docente
CREATE TRIGGER before_delete_docente
BEFORE DELETE ON usuarios_docente
FOR EACH ROW
BEGIN
  DELETE FROM horarios_docente WHERE docente_id = OLD.id_docente;
  DELETE FROM reservacion_cambio_salon WHERE docente_id = OLD.id_docente;
END;
//
DELIMITER ;

-- Trigger para actualizar historial de reservas al crearse una reserva 
DELIMITER $$

CREATE TRIGGER actualziar_reserva_estudiante
AFTER INSERT ON reservacion_estudiante
FOR EACH ROW
BEGIN
    INSERT INTO historial_reservas (usuario_id, tipo_usuario, fecha_reserva, accion)
    VALUES (NEW.estudiante_id, 'estudiante', NEW.fecha_reserva, 'Creación de reserva');
END $$

DELIMITER ;

-- Trigger que impide reservar un salon en el mismo horario si este esta ocupado 
DELIMITER $$

CREATE TRIGGER verificar_reserva_estudiante
BEFORE INSERT ON reservacion_estudiante
FOR EACH ROW
BEGIN
    DECLARE reserva_existente INT;
    
    SELECT COUNT(*)
    INTO reserva_existente
    FROM reservacion_estudiante
    WHERE aula_id = NEW.aula_id
    AND fecha_reserva = NEW.fecha_reserva
    AND (NEW.hora_inicio BETWEEN hora_inicio AND hora_fin OR
         NEW.hora_fin BETWEEN hora_inicio AND hora_fin);

    IF reserva_existente > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El aula/laboratorio ya está reservado en esa franja horaria';
    END IF;
END $$

DELIMITER ;
