    // lib/db.js
    const mysql = require('mysql');
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'pizzana',
      password: ''
    });

    connection.connect();

    module.exports = connection;