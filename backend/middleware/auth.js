const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log('tokenheders', token);
        // eslint-disable-next-line no-undef
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        //console.log('decodedToken', decodedToken);
        //console.log('decodedTokenexp', decodedToken.exp);
        const expireTime = (new Date().getTime() + 1) / 1000;
        //console.log('expireTime', expireTime);
        let userId = decodedToken.id;
        // console.log('userId', userId);
        //const user = JSON.parse(req.params.user);
        // console.log('user', user);  
        if (!userId) {
            // console.log('no');
            throw new Error('Utilisateur non reconnu');
        } 
        else { 
            if (expireTime > decodedToken.exp) {
                throw new Error('token non reconnu');               
            }
            next();
        }
        //console.log('yes');   
        
    } catch (error) {
        // console.log('error', error);
        res.status(httpStatus.UNAUTHORIZED).json({ error: 'Requête non authentifiée' });
    }
};