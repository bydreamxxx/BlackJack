var crypto = require('crypto');
const key = 'sllxibcibinaxuez';
var AES = {
    Encrypt(data) {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, key);
        var crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
        return data;
    },
    Decrypt(encrypted) {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, key);
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
        return encrypted;
    }
};
module.exports = AES;

