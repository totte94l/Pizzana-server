    // lib/db.js
    const mysql = require('mysql');
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'pizzana',
      password: '',
      // Dessa behövs till MAMP
/*       connector: "mysql",
      socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock" */
    });

    connection.connect();

    module.exports = connection;