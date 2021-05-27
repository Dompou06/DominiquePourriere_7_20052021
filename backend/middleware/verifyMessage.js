const Joi = require('joi');
const httpStatus = require('http-status');
module.exports = (req, res, next) => {
    const validate = checkMessage(req.body.title, req.body.body, req.body.author, req.body.departement);
    if (!validate) 
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Message non valide' });
    next();
};
/**
 * Check email & password
 * Définition du type, nom et description des paramètres utilisées dans la fonction checkSignUp
 * @param {string} title  title
 * @param {string} body  text
 * @param {string} media  name file
 * @param {string} caption  caption
  * @param {number} author  userId
  * @param {number} departement  departementId
* @returns {}
 */
function checkMessage (title, body, media, caption, author, departement) {
    const schema = Joi.object().keys(
        {
            title: Joi.string().required(),
            body: Joi.string().required(),
            media: Joi.string(),
            caption: Joi.string(),
            author: Joi.number().required(),
            departement: Joi.number().required()
        }
    );
    return schema.validate({ title, body, media, caption, author, departement });
}