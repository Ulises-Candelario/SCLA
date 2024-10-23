const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const port = 3000;

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

// Ruta para servir el archivo de reserva para estudiantes
app.get('/reserva/estudiante', (req, res) => {
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
  res.sendFile(path.join(__dirname, '../frontend/html/reserva_docente.html'));
});

// Ruta para obtener el horario del docente
app.get('/horario_docente', (req, res) => {
  const docente_id = 1; // Usar el docente_id del docente autenticado (esto es un ejemplo)

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
      // Verificar la contraseña para el estudiante (usa bcrypt)
      const student = studentResults[0];
      bcrypt.compare(password, student.password, (err, result) => {
        if (result) {
          return res.send('Inicio de sesión exitoso (Estudiante).');
        } else {
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
          // Para docentes, no aplicar bcrypt, ya que las contraseñas son texto plano
          const teacher = teacherResults[0];
          if (teacher.password === password) {
            return res.send('Inicio de sesión exitoso (Docente).');
          } else {
            return res.status(400).send('Contraseña incorrecta.');
          }
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
  const { estudiante_id, aula_id, fecha_reserva, hora_inicio, hora_fin } = req.body;

  const query = 'INSERT INTO reservacion_estudiante (estudiante_id, aula_id, fecha_reserva, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [estudiante_id, aula_id, fecha_reserva, hora_inicio, hora_fin], (err, result) => {
    if (err) {
      return res.status(500).send('Error al realizar la reserva');
    }
    res.send('Reserva realizada con éxito');
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
