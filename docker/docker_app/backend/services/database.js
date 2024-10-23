const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql_scla',  // Nombre del contenedor donde está la base de datos
  user: 'root',
  password: 'rootpassword',
  database: 'SCLA'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
});

module.exports = connection;
