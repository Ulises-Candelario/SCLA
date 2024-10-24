const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const port = 3000;

// Configurar las sesiones
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true si usas HTTPS
}));

// Middleware para parsear los cuerpos de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos de CSS y JavaScript
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'mysql_scla', // nombre del servicio del contenedor de MySQL
  user: 'root',
  password: 'rootpassword',
  database: 'SCLA'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para servir el archivo principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

// Ruta para servir el archivo de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

// Ruta para servir el archivo de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/register.html'));
});

app.get('/register_docente', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/register_docente.html'));
});

// Ruta para servir el archivo de registro
app.get('/mis_reservas', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/mis_reservas.html'));
});

// Ruta de registro de docentes (POST /register_docente)
app.post('/register_docente', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  // Verificar si el correo ya existe
  const searchQuery = 'SELECT * FROM usuarios_docente WHERE email = ?';
  db.query(searchQuery, [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).send('El correo ya está registrado.');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el docente en la base de datos
    const insertQuery = 'INSERT INTO usuarios_docente (nombre, apellido, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [nombre, apellido, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).send('Error al registrar el docente.');
      }
      res.send('Docente registrado con éxito.');
    });
  });
});

app.get('/register_horario_docente', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/register_horario_docente.html'));
});

// Ruta de registro de horarios para docentes (POST /register_horario_docente)
app.post('/register_horario_docente', (req, res) => {
  const { email, dia_semana, hora_inicio, hora_fin, aula } = req.body;

  // Buscar el id del docente a partir del correo electrónico
  const searchDocenteQuery = 'SELECT id_docente FROM usuarios_docente WHERE email = ?';
  db.query(searchDocenteQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error al buscar el docente.');
    }
    if (results.length === 0) {
      return res.status(404).send('Docente no encontrado.');
    }

    const docente_id = results[0].id_docente;

    // Insertar el horario en la base de datos
    const insertHorarioQuery = 'INSERT INTO horarios_docente (docente_id, dia_semana, hora_inicio, hora_fin, aula) VALUES (?, ?, ?, ?, ?)';
    db.query(insertHorarioQuery, [docente_id, dia_semana, hora_inicio, hora_fin, aula], (err, result) => {
      if (err) {
        return res.status(500).send('Error al registrar el horario.');
      }
      res.send('Horario registrado con éxito.');
    });
  });
});

// Ruta para servir el archivo de reserva para estudiantes
app.get('/reserva/estudiante', (req, res) => {
  if (!req.session.userId || req.session.userRole !== 'estudiante') {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../frontend/html/reserva_estudiante.html'));
});

// Ruta para obtener las aulas/laboratorios desde la base de datos
app.get('/aulas_laboratorios', (req, res) => {
  const query = 'SELECT * FROM aulas_laboratorios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las aulas/laboratorios:', err);
      return res.status(500).json({ error: 'Error al obtener las aulas/laboratorios' });
    }
    res.json(results); // Devuelve los resultados en formato JSON
  });
});

// Ruta para servir el archivo de reserva para docentes
app.get('/reserva/docente', (req, res) => {
  if (!req.session.userId || req.session.userRole !== 'docente') {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../frontend/html/reserva_docente.html'));
});

// Ruta para obtener el horario del docente
app.get('/horario_docente', (req, res) => {
  const docente_id = req.session.userId; // Usar el docente_id del docente autenticado

  const query = 'SELECT * FROM horarios_docente WHERE docente_id = ?';
  db.query(query, [docente_id], (err, results) => {
    if (err) {
      console.error('Error al obtener el horario del docente:', err);
      return res.status(500).json({ error: 'Error al obtener el horario' });
    }
    res.json(results); // Devuelve el horario del docente
  });
});

// Ruta de reserva para docentes (POST /reserva/docente)
app.post('/reserva/docente', (req, res) => {
  const { horario_clase, aula_nueva } = req.body;

  const query = 'UPDATE horarios_docente SET aula = ? WHERE id_horario = ?';
  db.query(query, [aula_nueva, horario_clase], (err, result) => {
    if (err) {
      console.error('Error al realizar el cambio de salón:', err);
      return res.status(500).send('Error al realizar el cambio');
    }
    res.send('Cambio de salón realizado con éxito');
  });
});

// Ruta de registro (POST /register)
app.post('/register', async (req, res) => {
  const { nombre, apellido, n_cuenta, email, password } = req.body;

  // Verificar si el correo ya existe
  const searchQuery = 'SELECT * FROM usuarios_estudiante WHERE email = ?';
  db.query(searchQuery, [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).send('El correo ya está registrado.');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el estudiante en la base de datos
    const insertQuery = 'INSERT INTO usuarios_estudiante (nombre, apellido, n_cuenta, email, password) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [nombre, apellido, n_cuenta, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).send('Error al registrar el estudiante.');
      }
      res.send('Estudiante registrado con éxito.');
    });
  });
});

// Ruta de inicio de sesión (POST /login)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar el correo en las tablas de estudiantes y docentes
  const searchStudentQuery = 'SELECT * FROM usuarios_estudiante WHERE email = ?';
  const searchTeacherQuery = 'SELECT * FROM usuarios_docente WHERE email = ?';

  // Primero buscar en la tabla de estudiantes
  db.query(searchStudentQuery, [email], (err, studentResults) => {
    if (err) {
      return res.status(500).send('Error en la base de datos.');
    }
    if (studentResults.length > 0) {
      // Verificar la contraseña para el estudiante usando bcrypt
      const student = studentResults[0];
      bcrypt.compare(password, student.password, (err, result) => {
        if (err) {
          return res.status(500).send('Error al verificar la contraseña.');
        }
        if (result) {
          // Contraseña correcta
          req.session.userId = student.id_estudiante;
          req.session.userRole = 'estudiante';
          return res.send('Inicio de sesión exitoso (Estudiante).');
        } else {
          // Contraseña incorrecta
          return res.status(400).send('Contraseña incorrecta.');
        }
      });
    } else {
      // Si no es estudiante, buscar en la tabla de docentes
      db.query(searchTeacherQuery, [email], (err, teacherResults) => {
        if (err) {
          return res.status(500).send('Error en la base de datos.');
        }
        if (teacherResults.length > 0) {
          // Verificar la contraseña para el docente usando bcrypt
          const teacher = teacherResults[0];
          bcrypt.compare(password, teacher.password, (err, result) => {
            if (err) {
              return res.status(500).send('Error al verificar la contraseña.');
            }
            if (result) {
              // Contraseña correcta
              req.session.userId = teacher.id_docente;
              req.session.userRole = 'docente';
              return res.send('Inicio de sesión exitoso (Docente).');
            } else {
              // Contraseña incorrecta
              return res.status(400).send('Contraseña incorrecta.');
            }
          });
        } else {
          // Si no se encuentra ni como estudiante ni como docente
          return res.status(404).send('Correo no encontrado.');
        }
      });
    }
  });
});

// Ruta de reserva para estudiantes (POST /reserva/estudiante)
app.post('/reserva/estudiante', (req, res) => {
  const { aula_id, fecha_reserva, hora_inicio, hora_fin } = req.body;
  const estudiante_id = req.session.userId; // Obtener el estudiante autenticado (según la sesión)

  // Comprobar si el aula/laboratorio está disponible
  const checkQuery = `
    SELECT * FROM reservacion_estudiante 
    WHERE aula_id = ? AND fecha_reserva = ? 
    AND (hora_inicio < ? AND hora_fin > ?)
  `;
  db.query(checkQuery, [aula_id, fecha_reserva, hora_fin, hora_inicio], (err, results) => {
    if (err) {
      return res.status(500).send('Error al verificar la disponibilidad');
    }
    if (results.length > 0) {
      return res.status(400).send('El aula/laboratorio no está disponible en este horario');
    }

    // Si está disponible, realizar la reserva
    const insertQuery = `
      INSERT INTO reservacion_estudiante (estudiante_id, aula_id, fecha_reserva, hora_inicio, hora_fin)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [estudiante_id, aula_id, fecha_reserva, hora_inicio, hora_fin], (err, result) => {
      if (err) {
        console.error('Error al realizar la reserva:', err);
        return res.status(500).send('Error al realizar la reserva');
      }

// Registrar en el historial de reservas
const historialQuery = `
  INSERT INTO historial_reservas (usuario_id, tipo_usuario, fecha_reserva)
  VALUES (?, 'estudiante', ?)
`;
db.query(historialQuery, [estudiante_id, fecha_reserva], (err, result) => {
  if (err) {
    console.error('Error al guardar en el historial:', err);
    return res.status(500).send('Error al guardar en el historial');
  }
  res.send('Reserva realizada con éxito');
});
    });
  });
});

// Ruta para verificar la disponibilidad de un aula/laboratorio
app.get('/disponibilidad/:aula_id/:fecha_reserva/:hora_inicio/:hora_fin', (req, res) => {
  const { aula_id, fecha_reserva, hora_inicio, hora_fin } = req.params;

  const checkQuery = `
    SELECT * FROM reservacion_estudiante 
    WHERE aula_id = ? AND fecha_reserva = ?
    AND (hora_inicio < ? AND hora_fin > ?)
  `;
  db.query(checkQuery, [aula_id, fecha_reserva, hora_fin, hora_inicio], (err, results) => {
    if (err) {
      console.error('Error al verificar la disponibilidad:', err);
      return res.status(500).json({ error: 'Error al verificar la disponibilidad' });
    }
    if (results.length > 0) {
      res.json({ disponible: false });
    } else {
      res.json({ disponible: true });
    }
  });
});



// Ruta de reserva para docentes (POST /reserva/docente)
app.post('/reserva/docente', (req, res) => {
  const { docente_id, aula_nueva, fecha_cambio, hora_inicio, hora_fin } = req.body;

  const query = 'INSERT INTO reservacion_cambio_salon (docente_id, aula_nueva, fecha_cambio, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [docente_id, aula_nueva, fecha_cambio, hora_inicio, hora_fin], (err, result) => {
    if (err) {
      return res.status(500).send('Error al realizar el cambio');
    }
    res.send('Cambio de salón realizado con éxito');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
