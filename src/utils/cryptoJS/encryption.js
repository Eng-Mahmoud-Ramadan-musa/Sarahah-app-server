import cryptoJS from 'crypto-js';

const deriveKey = (secretKey) => {
    return cryptoJS.SHA256(secretKey).toString(cryptoJS.enc.Hex); // اشتقاق مفتاح ثابت
};

export const encrypt = ({ plainText, secret_key = process.env.SECRET_KEY }) => {
    const key = deriveKey(secret_key); // استخدام مفتاح ثابت
    const iv = cryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // IV ثابت
    const encrypted = cryptoJS.AES.encrypt(plainText, cryptoJS.enc.Hex.parse(key), { iv });
    return encrypted.toString();
};

export const decrypt = ({ cipherText, secret_key = process.env.SECRET_KEY }) => {
    const key = deriveKey(secret_key); // استخدام نفس المفتاح
    const iv = cryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // نفس IV المستخدم في التشفير
    const decrypted = cryptoJS.AES.decrypt(cipherText, cryptoJS.enc.Hex.parse(key), { iv });
    return decrypted.toString(cryptoJS.enc.Utf8);
};
