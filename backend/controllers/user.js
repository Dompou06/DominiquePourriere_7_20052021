/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const httpStatus = require('http-status');
const crypted = require('../utils/crypt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fse = require('fs-extra');
const db = require('../utils/connexion');
const decrypted = require('../utils/crypt');

exports.user = (req, res) => {
    const token = req.headers.authorization; 
    //  console.log('headerValue', headerValue);
    // const tokensplit = req.headers.authorization.split(' ');
    // console.log('tokensplit', tokensplit);
    // On récupère l'userId dans le token
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        //console.log('decodedToken', decodedToken);       
        let idUser = decodedToken.id;    
        // console.log(idUser);
        db.query('SELECT *, NULL AS password FROM users WHERE id_user = ?', idUser, (error, result) => {
            if(result === undefined){
            // En production
                if(process.env.NODE_ENV === 'production'){
                // console.log(error);
                    return res.status(httpStatus.NOT_FOUND).json({ message: 'Utilisateur inconnu' });
                } 
                // En développement
                // console.log('error', error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Utilisateur inconnu' });          
            }
            else {
            // console.log(result);
            // On vérifie s'il a un statut
                db.query('SELECT * FROM users WHERE user_admin = ?', idUser, (error, res) => {        
                    console.log('res', res);
                    return res.status(httpStatus.OK).json({
                        firstnameDecrypt: decrypted.decrypt(result[0].firstname),
                        lastnameDecrypt: decrypted.decrypt(result[0].lastname)
                    });
                });
            }
        });
    } catch(err) {
        // Le token n'est pas valide
        // console.log('err', err);
        return res.status(httpStatus.NOT_FOUND).json({ message: ':(' });
    }

};
exports.signup = (req, res) => {
    let dateCreate = new Date();   
    const saltRounds = 10;
    //const password = bcrypt.hashSync(req.body.password, saltRounds);
    let dataUser = {};
    let filename = '';
    // console.log('req', req);
    if(req.file === undefined)   
    {
        dataUser = {
            firstname: crypted.encrypt(req.body.firstname),
            lastname: crypted.encrypt(req.body.lastname),
            email: crypted.encrypt(req.body.email),
            password: bcrypt.hashSync(req.body.password, saltRounds), 
            departement: req.body.departement,
            user_created_at: dateCreate
        };
        // console.log(dataUser);
    }
    else {
        //const storage = 'media';
        // console.log('storage', storage);
        filename = req.file.filename;
        // console.log('filename', filename);
        const objectUser = req.body.user;
        const user = JSON.parse(objectUser);
        // console.log('objectUser', objectUser);
        dataUser = {
            firstname: crypted.encrypt(user.firstname),
            lastname: crypted.encrypt(user.lastname),
            email: crypted.encrypt(user.email),
            password: bcrypt.hashSync(user.password, saltRounds), 
            departement: user.departement, 
            image_user: filename, 
            user_created_at: dateCreate
        };
        // console.log('dataUser', dataUser);
    }
    // console.log('dataUser', dataUser);
    // Une contrainte unique a été intégrée dans la BD sur l'email
    db.query('INSERT INTO users SET ?', dataUser,  (error, result) => {
        // console.log(result);
        if (!result) {
            // En production
            if(process.env.NODE_ENV === 'production'){
                console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Inscription invalide' });
            } 
            // En développement
            // console.log(error);

            // return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Inscription invalide' });
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Inscription invalide' });
        }
        let payload = { 'id': result.insertId };
        let token = jwt.sign(
            payload,
            // eslint-disable-next-line no-undef
            process.env.TOKEN,
            { expiresIn: '24h' }
        );
        return res.status(httpStatus.OK).json({ isToken: token });
    });
};
exports.login = (req, res) => {
    // console.log('req', req);
    const email = crypted.encrypt(req.body.email);
    //console.log('email', email);
    db.query('SELECT * FROM users WHERE email = ?', email, (error, result) => {
        // console.log('result', result[0]);
        //console.log('password', bcrypt.compare(req.body.password, result[0].password));
        if(result[0] === undefined || error){
            // En production
            if(process.env.NODE_ENV === 'production'){
                //console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Connexion invalide' });
            } 
            // En développement
            // console.log('error', error);
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Connexion invalide' });          
        }
        else {
            // On compare les password cryptés
            bcrypt.compare(req.body.password, result[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Connexion invalide' });
                    }
                    //On cherche si l'utilisateur a des droits d'administration
                    let user_admin = result[0].id_user;
                    // console.log('result[0].id_user', result[0].id_user);
                    db.query('SELECT * FROM admin_base WHERE user_admin = ?', user_admin, (error, results) => {
                        // console.log('results', results);  
                        var string = JSON.stringify(results);
                        // console.log('string', string);
                        var json =  JSON.parse(string);
                        // console.log('results', results);
                        if(results.length !== 0) {
                            // console.log('json', json[0].moderation);
                            //console.log('json', json[0].delete_user);
                            let payload = { 
                                'id': result[0].id_user
                            };
                            let token = jwt.sign(
                                payload,
                                // eslint-disable-next-line no-undef
                                process.env.TOKEN,
                                { expiresIn: '24h' }
                            );
                            return res.status(httpStatus.OK).json({ 
                                userId: result[0].id_user,
                                moderation: json[0].moderation,
                                admin: json[0].delete_user,
                                token       
                            });
                        }
                        else {
                            //console.log('result[0].id', result[0].id_user);
                            let payload = { 'id': result[0].id_user };
                            let token = jwt.sign(
                                payload,
                                // eslint-disable-next-line no-undef
                                process.env.TOKEN,
                                { expiresIn: '24h' }
                            );
                            //  console.log('id', result[0].id_user, 'token', token);
                            return res.status(httpStatus.OK).json({ 
                                userId: result[0].id_user,
                                token       
                            });
                        }
                    });
                })
                .catch(error => res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error }));
        }
    });
};
exports.profil = (req, res) => {
    // On récupère l'userId dans le token
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    let idUser = decodedToken.id; 
    // On sélectionne tous les champs de l'utilisateur sauf password
    let idAuthor = req.params.author;
    if(idAuthor === 'null') {
        idAuthor = idUser;
    }
    console.log('idAuthor',idAuthor);
    db.query(`SELECT *, NULL AS password 
    FROM users u
    LEFT JOIN departements d ON d.id = u.departement 
    WHERE id_user = ?`, idAuthor, (error, result) => {
        // console.log(result);
        if(result === undefined){
            // En production
            if(process.env.NODE_ENV === 'production'){
                // console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Utilisateur inconnu' });
            } 
            // En développement
            // console.log('error', error);
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Utilisateur inconnu' });          
        }
        else {
            // console.log(result);
            const finalResponse = {
                firstnameDecrypt: decrypted.decrypt(result[0].firstname),
                lastnameDecrypt: decrypted.decrypt(result[0].lastname),
                departement: result[0].departement,
                nameDepartement: result[0].name_departement,
                image_user: result[0].image_user
            };
            let hasAdminRights = false;
            db.query('SELECT moderation FROM admin_base WHERE user_admin = ?', idUser,
                (_error, resultFromDb) => {
                    if((resultFromDb[0] && resultFromDb.pop().moderation) || idUser === idAuthor) hasAdminRights = true;
                    //  console.log('userId', userId, 'hasAdminRights', hasAdminRights);
                    return res.status(httpStatus.OK).json({
                        ...finalResponse,
                        hasAdminRights
                    });
                });

        }
    });
};
exports.delete = (req, res) => {
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    let userRights = decodedToken.id; 
    let profileUpadating = req.params.user;
    // console.log('profileUpadating', profileUpadating);
    let idProfile = '';
    let hasAdminRights = false;

    if (profileUpadating === 'null') {
        idProfile = userRights;
        console.log('idProfile', idProfile);
        db.query('SELECT image_user FROM users WHERE id_user = ?', idProfile, (error, result) => {
            // On vérifie si un fichier se trouve dans BD
            // console.log('result', result[0].image_user);
            if(result[0].image_user !== null){
                // On le supprime du backend
                const deleteFile = result[0].image_user;
                // console.log('deleteFile', deleteFile);
                fse.remove(`media/${deleteFile}`, error => {
                    if (error) return console.error(error);
                    console.log('Fichier supprimé');
                });
            }
        });
        db.query('DELETE FROM users WHERE id_user LIKE ?', idProfile, (error, result) => {
            if(!result){
                // En production
                if(process.env.NODE_ENV === 'production'){
                    console.log(error);
                    return res.status(httpStatus.NOT_FOUND).json({ message: 'Profil non supprimés' });
                } 
                // En développement
                return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Profil non supprimés' });          
            }
            return res.status(httpStatus.OK).json({ 
                adminRights: hasAdminRights,
                message: 'Profil supprimé' 
            });
        });
    }
    else {
        idProfile = profileUpadating;
        db.query('SELECT * FROM admin_base WHERE user_admin = ?', userRights,
            (_error, resultFromDb) => {
            // console.log('profileUpadating', profileUpadating, 'resultFromDb[0]', resultFromDb[0]);
            //console.log('resultFromDb[0]', resultFromDb[0]);
            // if(profileUpadating === 'null' || resultFromDb[0] === true) {
                if(resultFromDb[0].delete_user === 'true') {
                    hasAdminRights = true; }
                // console.log('idProfile', idProfile);
                db.query('SELECT image_user FROM users WHERE id_user = ?', idProfile, (error, result) => {
                // On vérifie si un fichier se trouve dans BD
                // console.log('result', result[0].image_user);
                    if(result[0].image_user !== null){
                    // On le supprime du backend
                        const deleteFile = result[0].image_user;
                        // console.log('deleteFile', deleteFile);
                        fse.remove(`media/${deleteFile}`, error => {
                            if (error) return console.error(error);
                            console.log('Fichier supprimé');
                        });
                    }
                });
                db.query('DELETE FROM users WHERE id_user LIKE ?', idProfile, (error, result) => {
                    if(!result){
                        // En production
                        if(process.env.NODE_ENV === 'production'){
                            console.log(error);
                            return res.status(httpStatus.NOT_FOUND).json({ message: 'Profil non supprimés' });
                        } 
                        // En développement
                        return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Profil non supprimés' });          
                    }
                    return res.status(httpStatus.OK).json({ 
                        adminRights: hasAdminRights,
                        message: 'Profil supprimé' 
                    });
                });
            }); 
    }
        
};
exports.update = (req, res) => {
    const headerValue = req.headers.authorization; 
    const token = headerValue.substr(6);
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    let userRights = decodedToken.id; 
    let dateUpdate = new Date();
    const dataUser = JSON.parse(req.body.profil);
    let profileUpadating = dataUser.id_profile;
    // On vérifie que l'utilisateur a bien des droits d'auteur ou de modération
    //if(profileUpadating !== null ) { let userAdmin = userRights; }
    // console.log('profileUpadating', profileUpadating);

    db.query('SELECT delete_user FROM admin_base WHERE user_admin = ?', userRights,
        (_error, resultFromDb) => {
            if((resultFromDb[0] && resultFromDb.pop().delete_user) || profileUpadating === 'null') {
                let updateUser = {                    
                    firstname: crypted.encrypt(dataUser.firstname),
                    lastname: crypted.encrypt(dataUser.lastname),
                    departement: dataUser.departement, 
                    user_updated_at: dateUpdate
                };
                // console.log('idProfile', idProfile);
                let idProfile = '';
                if(profileUpadating === 'null' ) { idProfile = userRights; }
                else { idProfile = profileUpadating; }  
                // Si un fichier est envoyé
                if(req.file !== undefined){
                    db.query('SELECT image_user FROM users WHERE id_user = ?', idProfile, (error, result) => {
                        // On vérifie si un fichier se trouve dans BD
                        // console.log('result', result[0].image_user);
                        if(result[0].image_user !== null){
                            // On le supprime du backend
                            const deleteFile = result[0].image_user;
                            // console.log('deleteFile', deleteFile);
                            fse.remove(`media/${deleteFile}`, error => {
                                if (error) return console.error(error);
                                console.log('Fichier supprimé');
                            });
                        }
                    });
                    let filename = `${req.file.filename}`;
                    updateUser = {                    
                        firstname: crypted.encrypt(dataUser.firstname),
                        lastname: crypted.encrypt(dataUser.lastname),
                        departement: dataUser.departement,
                        image_user: filename,
                        user_updated_at: dateUpdate
                    };
                }   
                //   console.log('idProfile', idProfile);
                // On met à jour le profil dans la base de données
                db.query('UPDATE users SET ? WHERE id_user = ?', [ updateUser, idProfile ], (error, result) => {
                    if(!result || error) {
                        // En production
                        if(process.env.NODE_ENV === 'production'){
                            console.log(error);
                            return res.status(httpStatus.NOT_FOUND).json({ message: 'Profil non modifié' });
                        } 
                        // En développement
                        return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Profil non modifié' });
                    }
                    return res.status(httpStatus.OK).json({ message: 'Profil modifié' });
                }); 
        
            }
        });
  

};
exports.admin = (req, res) => {
    const user = req.params.user;
    // console.log('user', user);
    db.query('SELECT * FROM admin_base WHERE user_admin = ?', user, (error, result) => {
        // console.log('result', result[0]);
        if(result === undefined){
            // En production
            if(process.env.NODE_ENV === 'production'){
                // console.log(error);
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Utilisateur inconnu' });
            } 
            // En développement
            // console.log('error', error);
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Utilisateur inconnu' });          
        }
        else {
            //console.log('resultm', result[0]);
            var string = JSON.stringify(result);
            // console.log('string', string);
            var json =  JSON.parse(string);
            // console.log('json', json[0].moderation);

            return res.status(httpStatus.OK).json({
                moderation: json[0].moderation, 
                delete_user: json[0].delete_user
            });
        }
    });
};
