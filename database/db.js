const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'freecontrol_db'
});

connection.connect((err) => {
  if (err) {
    console.log('Error conexión BD:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

module.exports = connection;