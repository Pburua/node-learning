const mysql = require('mysql2');

const { 
    MYSQL_HOST,
    MYSQL_USER,
    DATABASE_NAME,
    DATABASE_PASSWORD 
} = require('../env');

const pool = mysql.createPool({ 
    host: MYSQL_HOST,
    user: MYSQL_USER,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD
});

module.exports = pool.promise();
