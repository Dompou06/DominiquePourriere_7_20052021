const Joi = require('joi');
const httpStatus = require('http-status');
module.exports = (req, res, next) => {
    const validate = checkSignUp(req.body.email, req.body.password);
    if (!validate) {
        //  console.log('no');
        // Renvoie un statut NOT FOUND et me message d'erreur si au moins un n'est pas valide
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Inscription non valide' });
        // return res.status(httpStatus.NOT_FOUND).json({ message: error.details[0].message })
    } else {
        // Si valide, on continue
        // console.log('ok');
        next();
    }
};
/**
 * Check email & password
 * Définition du type, nom et description des paramètres utilisées dans la fonction checkSignUp
 * @param {string} email  email
 * @param {string} password  password
 * @returns {}
 */
function checkSignUp (firstname, lastname, email, password) {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;
    const schema = Joi.object().keys(
        {
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(RegExp(pattern)).required()
        }
    );
    return schema.validate({ firstname, lastname, email, password });
}