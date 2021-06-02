/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const httpStatus = require('http-status');
const fse = require('fs-extra');
const db = require('../utils/connexion');
const decrypted = require('../utils/crypt');
const jwt = require('jsonwebtoken');


exports.createMessage = (req, res) => {
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    let userId = decodedToken.id;
    let dateCreate = new Date();   
    let dataMessage = {};
    let filename = '';
    //console.log(req.file);
    // On récupère le département de l'utilisateur
    db.query(`SELECT id
    FROM users u
    LEFT JOIN departements d ON d.id = u.departement
    WHERE id_user = ?
    `, userId, (_error, resultDepartement) => {
        //console.log('resultDepartement', resultDepartement[0]);
        let string =  JSON.stringify(resultDepartement);
        let jsonDepartement =  JSON.parse(string);
        let departement = jsonDepartement[0].id;
        
        if(req.file !== undefined)   
        {
            filename = req.file.filename;
            // console.log('filename', filename);
            //  console.log('req.body.message', req.body.message);
            const objectMessage = req.body.message;
            const message = JSON.parse(objectMessage);
            // console.log('messageObject', message);
            dataMessage = {
                ...message,
                author: userId,
                departement: departement,
                media: filename, 
                created_at: dateCreate 
            };
        }
        else{
        // console.log(req.body);
            const objectMessage = req.body.message;
            const message = JSON.parse(objectMessage);
            dataMessage = {
                ...message, 
                author: userId,
                departement: departement,
                created_at: dateCreate};
        }
        //console.log('dataMessage', dataMessage);
        db.query('INSERT INTO messages SET ?', dataMessage,  (error, result) => {
            if (!result) {
                //En développement 
                return res.status(httpStatus.UNAUTHORIZED).json({ error, message: 'Message invalide' });
                // En production
                /* console.log(error);
                 return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Message invalide' });*/
            }
            return res.status(httpStatus.OK).json({ message: result.insertId });       
        });
    });

};
exports.getAllMessage = (_req, res) => {
    db.query(`SELECT *, 
    GROUP_CONCAT(user_id SEPARATOR ",") AS userslike,
    initial
    FROM messages m
    LEFT JOIN departements d ON d.id = m.departement
    LEFT JOIN likes l ON l.message_id = m.id_message
    GROUP BY m.id_message
         ORDER BY m.created_at DESC LIMIT 10`, (error, results) => {
        if (!results || error) {
            // En production
            if(process.env.NODE_ENV === 'production'){
                console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Aucun message accessible' });
            } 
            // En développement
            return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Aucun message accessible' });
        } 
        //console.log(results);
        return res.status(httpStatus.OK).json(results);
    });
};
exports.getOneMessage = (req, res) => {
    const idMessage = req.params.id;
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    // console.log('headerValue', headerValue, 'token', token);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    let userId = decodedToken.id;
    //  console.log('idMessage', idMessage);
    // console.log('userId', userId);
    db.query(`SELECT *, 
    NULL AS password
    FROM messages m
    LEFT JOIN users u ON u.id_user = m.author
    LEFT JOIN departements d ON d.id = m.departement
    WHERE m.id_message = ?
    GROUP BY m.id_message
    `, idMessage, (error, result) => {
        //  console.log('result', result);
        if(!result || error) {
            // En production
            if(process.env.NODE_ENV === 'production'){
                console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Aucun message accessible' });
            } 
            // En développement
            return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Aucun message accessible' });
        }
        else {
            let media = '';
            // console.log('media', result[0].media);
            if(result[0].media === null) { media = null; }
            else {
                const fileExisting = `media/${result[0].media}`;
                fse.ensureFile(fileExisting)
                    .then(() => {
                        // console.log('success!');
                        media = `http://localhost:3000/media/${result[0].media}`;
                    })
                    .catch(_err => {
                        //  console.error(err);
                        media = null;
                    });           
            }
            let imgUser = '';
            //  console.log('imgUser', result[0].image_user);
            if(result[0].image_user === null) { imgUser = null; }
            else {
                const fileExisting = `media/${result[0].image_user}`;
                fse.ensureFile(fileExisting)
                    .then(() => {
                        // console.log('success!');
                        imgUser = `http://localhost:3000/media/${result[0].image_user}`;
                    })
                    .catch(_err => {
                        console.error(err);
                        // imgUser = null;
                    });           
            }
            const finalResponse = {
                idAuthor: result[0].author,
                idMessage: result[0].id_message,
                title: result[0].title,
                body: result[0].body,
                caption: result[0].caption,
                initial: result[0].initial,
                departement: result[0].name_departement,
                firstnameDecrypt: decrypted.decrypt(result[0].firstname),
                lastnameDecrypt: decrypted.decrypt(result[0].lastname),
                created_at: result[0].created_at,
                updated_at: result[0].updated_at,
                userslike: result[0].userslike
            };
            let hasAdminRights = false;
            db.query('SELECT moderation FROM admin_base WHERE user_admin = ?', userId,
                (_error, resultFromDb) => {
                    if((resultFromDb[0] && resultFromDb.pop().moderation) || userId === result[0].author) hasAdminRights = true;
                    //  console.log('userId', userId, 'hasAdminRights', hasAdminRights);
                    return res.status(httpStatus.OK).json({
                        ...finalResponse,
                        media,
                        imgUser,
                        hasAdminRights
                    });
                });
            
        }
    });
    
};
exports.deleteOneMessage = (req, res) => {
    const idMessage = req.params.id;
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.id;
    // On vérifie que l'utilisateur a bien des droits d'auteur ou de modération 
    db.query(`
    SELECT author FROM messages
    WHERE id_message = ${idMessage} 
    `, idMessage, (_error, resToAuthor) => {
        let string =  JSON.stringify(resToAuthor);
        let jsonAuthor =  JSON.parse(string);
        db.query(`
            SELECT moderation FROM admin_base
            WHERE user_admin = ?
            `, userId, (_error, resToModeration) => {
            let string =  JSON.stringify(resToModeration);
            let jsonAdmin =  JSON.parse(string);
            // console.log('userId', userId, 'author', jsonAuthor[0].author, 'moderation', jsonAdmin[0].moderation );
            if (jsonAuthor[0].author === userId || jsonAdmin[0].moderation === 'true') {
                // On vérifie si dans la BD, il existait un fichier pour ce message
                db.query('SELECT media FROM messages WHERE id_message = ?', idMessage, (_error, result) => {
                    // console.log('tableau media', result[0].media);
                    // Si un fichier existe
                    if(result[0].media !== null){
                        // On le supprime du backend
                        const deleteFile = result[0].media;
                        fse.remove(`media/${deleteFile}`, error => {
                            if (error) return console.error(error);
                            // console.log('Fichier supprimé');
                        });
                    }
                });
                // On supprime le message
                db.query('DELETE FROM messages WHERE id_message = ?', idMessage, (error) => {
                    if(error) {
                        // En production
                        if(process.env.NODE_ENV === 'production'){
                            console.log('error', error);
                            return res.status(httpStatus.NOT_FOUND).json({ message: 'Aucun message accessible' });
                        } 
                        // En développement
                        console.log('error', error);
            
                        return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Aucun message accessible' });
                    }
                    return res.status(httpStatus.OK).json({ message: 'Message supprimé'});
                });
            }
        });
    });
};
exports.updateMessage = (req, res) => {
    const idMessage = req.params.id;    
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.id;
    let dateUpdate = new Date(); 
    // On vérifie si dans la BD, il existait un fichier pour ce message et qu'un nouveau fichier a été envoyé
    db.query('SELECT media FROM messages WHERE id_message = ?', idMessage, (_error, result) => {
        // console.log('tableau media', result[0].media);
        // Si un fichier existe
        if(result[0].media !== null && req.file !== undefined){
            // On le supprime du backend
            const deleteFile = result[0].media;
            fse.remove(`media/${deleteFile}`, error => {
                if (error) return console.error(error);
                // console.log('Fichier supprimé');
            });
        }
    });
    // On prépare les données à mettre à jour
    const message = JSON.parse(req.body.message);
    let dataMessage = {};
    if(req.file !== undefined){
        let filename = req.file.filename;
        dataMessage = {
            ...message, 
            media: filename, 
            updated_at: dateUpdate
        };
    }
    else {
        dataMessage = {
            ...message, 
            updated_at: dateUpdate
        };
    }
    // On vérifie que l'utilisateur a bien des droits d'auteur ou de modération
    db.query(`
    SELECT author FROM messages
    WHERE id_message = ${idMessage} 
    `, idMessage, (_error, resToAuthor) => {
        let string =  JSON.stringify(resToAuthor);
        let jsonAuthor =  JSON.parse(string);
        db.query(`
            SELECT moderation FROM admin_base
            WHERE user_admin = ?
            `, userId, (_error, resToModeration) => {
            let string =  JSON.stringify(resToModeration);
            let jsonAdmin =  JSON.parse(string);
            // console.log('userId', userId, 'author', jsonAuthor[0].author, 'moderation', jsonAdmin[0].moderation );
            if (jsonAuthor[0].author === userId || jsonAdmin[0].moderation === 'true') {
                // envoie la mise à jour
                // console.log('dataMessage', dataMessage);
                db.query('UPDATE messages SET ? WHERE id_message = ?', [ dataMessage, idMessage ], (error, result) => {
                    if(!result || error) {
                        // En production
                        if(process.env.NODE_ENV === 'production'){
                            console.log(error);
                            return res.status(httpStatus.NOT_FOUND).json({ message: 'Aucun message accessible' });
                        } 
                        // En développement
                        return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Aucun message accessible' });
                    }
                    return res.status(httpStatus.OK).json({ message: 'Message modifié' });
                });
            }

            else {
                console.log('Message non modifié');
            }
        });
    });
};