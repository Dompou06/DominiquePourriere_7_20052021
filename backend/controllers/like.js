/* eslint-disable no-undef */
const db = require('../utils/connexion');
const httpStatus = require('http-status');
exports.likeDislike = (req, res) => {
    const idMessage = req.params.id;
    const idUser = req.body.idUser;
    // console.log(idUser);
    let dateCreate = new Date();   
    let dataLike = {message_id: idMessage, user_id: idUser, created_at: dateCreate};
    // On vérifie si l'utilisateur a déjà liké le message
    db.query(`SELECT COUNT(user_id) AS nblikes 
        FROM likes 
            WHERE message_id = ? AND user_id = ?`, 
    [idMessage, idUser], (error, results) => {
        if(error) return res.status(httpStatus.UNAUTHORIZED).json({ error, message: 'Like invalide' }); 
        console.log('resultat', results[0].nblikes);
        // Si le résultat est différent de 0, l'utilisateur retire son like   
        if(results[0].nblikes === 0){
            // Sinon, l'utilisateur like
            // On ajoute sa ligne dans la BD
            db.query('INSERT INTO likes SET ?', [dataLike], (error) => {
                if(error) {
                    // En production
                    if(process.env.NODE_ENV === 'production'){
                        console.log(error);
                        return res.status(httpStatus.NOT_FOUND).json({ message: 'Like non ajouté' });
                    } 
                    // En développement
                    return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Like non ajouté' });
                }
                return res.status(httpStatus.OK).json({ message: 'like ajouté' });        
            });
        }
        else {
            // On supprime sa ligne dans la BD
            db.query(`DELETE FROM likes 
            WHERE message_id = ? AND  user_id = ?`, [idMessage, idUser], (error) => {
                if(error) {
                // En production
                    if(process.env.NODE_ENV === 'production'){
                        console.log(error);
                        return res.status(httpStatus.NOT_FOUND).json({ message: 'Like non supprimé' });
                    } 
                    // En développement
                    return res.status(httpStatus.NOT_FOUND).json({ error, message: 'Like non supprimé' });
                }
                return res.status(httpStatus.OK).json({message: 'Like supprimé'});        
            });
        }
    });
};