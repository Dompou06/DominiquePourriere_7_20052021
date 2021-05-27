const express = require('express');
const mysql = require('mysql');

// Création d'une connection à MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'intranet_groupomania'
});
// Connection à MySql
db.connect(err => {
    if(err) {
    // throw 'Non Connecté à MySQL';
        console.log(err.code);
        console.log(err.fatal);
    }
    console.log('Connecté à MySQL');
});
const app = express();
// Création de la base de données
app.get('/', (req, res) => {
    const allUsers = 'SELECT * FROM users';
    db.query(allUsers, (err, rows, fields) =>{
        if(err) {
        // throw err;
            console.log(+err.code);
            console.log(+err.fatal);
        }
        res.send('Accès à la table users\r\n'); 
        console.log(rows);
    });
});
app.listen(3000);