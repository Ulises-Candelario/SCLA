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
