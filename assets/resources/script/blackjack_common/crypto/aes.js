const key = CryptoJS.enc.Utf8.parse('sllxibcibinaxuez');
var AES = {
    // Encrypt(data) {
    //     const cipher = crypto.createCipheriv('aes-128-cbc', key, key);
    //     var crypted = cipher.update(data, 'utf8', 'hex');
    //     crypted += cipher.final('hex');
    //     return crypted;
    // },
    // Decrypt(encrypted) {
    //     const decipher = crypto.createDecipheriv('aes-128-cbc', key, key);
    //     var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    //     decrypted += decipher.final('utf8');
    //     return decrypted;
    // }
    Encrypt(data) {
        let srcs = CryptoJS.enc.Utf8.parse(data);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: key});
        return encrypted.ciphertext.toString();

        // const cipher = CryptoJS.algo.AES.createEncryptor(key, {iv: key});
        // var crypted = cipher.process(data);
        // crypted += cipher.finalize();
        // return crypted;
    },
    Decrypt(encrypted) {
        // const decipher = CryptoJS.algo.AES.createDecryptor(key, {iv: key});
        // var decrypted = decipher.process(encrypted);
        // decrypted += decipher.finalize();
        // return decrypted;
    }
};
module.exports = AES;

