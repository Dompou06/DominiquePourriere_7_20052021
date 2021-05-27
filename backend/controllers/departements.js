/* eslint-disable no-undef */
const httpStatus = require('http-status');
const db = require('../utils/connexion');

exports.getAllDepartements = (req, res) => {
    // db.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 10', (error, results) => {
    db.query(`SELECT id, name_departement 
    FROM departements
    ORDER BY name_departement
                `, (error, results) => {
        //console.log(results);
        if (!results || error) {
            // En production
            if(process.env.NODE_ENV === 'production'){
                console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Aucun département accessible' });
            } 
            // En développement
            return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Aucun département accessible' });
        } 
        //console.log(results);
        return res.status(httpStatus.OK).json(results);
    });
};