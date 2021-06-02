/* eslint-disable no-undef */
const mysql = require('mysql');
const mysqlHost = process.env.MYSQL_HOST;
const mysqlPort = process.env.MYSQL_PORT;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASS;
const mysqlDB = process.env.MYSQL_DB;

const connectionOptions = {
    host: mysqlHost,
    port: mysqlPort,
    user: mysqlUser,
    password: mysqlPassword,
    database: mysqlDB,
    // Utile ?
    multipleStatements: true
};
module.exports = mysql.createConnection(connectionOptions);

