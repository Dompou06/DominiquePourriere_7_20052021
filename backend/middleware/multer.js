/* eslint-disable no-undef */
const multer = require('multer');
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png', 
    'video/avi': 'avi', 
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg'
};

const storage = multer.diskStorage({
    // Indication de la destination d'enregistrement du fichier
    destination: (req, file, callback) => {
        //console.log(file);
        // null pour pas d'erreur et nom du dossier
        // console.log('champ', file.fieldname);
        callback(null, 'media');
    },
    filename: (req, file, callback) => {
        //console.log('champ', file.originalname);
        let name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];  
        // console.log('extension', file.mimetype);
        name = name.replace('.' + extension, '_');        
        const media = name + Date.now() + '.' + extension;
        callback(null, media);       
    }
});
module.exports = multer({ storage }).single('media');

