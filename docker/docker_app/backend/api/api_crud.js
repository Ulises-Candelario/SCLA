const express = require('express');
const router = express.Router();
const db = require('../services/database');

// Ruta para obtener todas las reservas
router.get('/reservas', (req, res) => {
  db.query('SELECT * FROM reservacion_estudiante', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

module.exports = router;
