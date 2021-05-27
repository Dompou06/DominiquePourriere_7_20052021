const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
// eslint-disable-next-line no-undef
const keyCrypt = process.env.CRYPT;
const key = crypto.scryptSync(keyCrypt, 'salt', 24);
// eslint-disable-next-line no-undef
const iv = Buffer.alloc(16, 8);
exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
exports.decrypt = (text) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
  