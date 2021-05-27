const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const httpStatus = require('http-status');
const db = require('./utils/connexion');
// Connection à MySql
db.connect(err => {
    if(err) {
    // throw 'Non Connecté à MySQL';
        console.log(err.code);
        console.log(err.fatal);
    }  
    console.log('Connection à MySQL réussie');
});
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const userRoutes = require('./routes/user');
const departementsRoutes = require('./routes/departements');
// eslint-disable-next-line no-undef
app.use('/media', express.static(path.join(__dirname, 'media')));
const messageRoutes = require('./routes/message');
const likeRoutes = require('./routes/like');

app.use('/api/departements', departementsRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/likes', likeRoutes);
app.get('*', (req, res) => {
    // console.log(req);
    return res.status((httpStatus.NOT_FOUND)).json({ error: 'Chemin invalide' });
});
//db.end();
module.exports = app;