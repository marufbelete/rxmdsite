const crypto = require('crypto');
const ENCRYPTION_KEY="ov1MRTU6Mwdil0y3L8HYYcAWPGQRQNDC"
function encryptSensitiveFields(patient) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const encryptedValues = {};
    for (const key in patient) {
      if (isSensitiveField(key)) {
        const value = patient[key];
        if (value) {
          let encrypted = cipher.update(value, 'utf8', 'hex');
          encrypted += cipher.final('hex');
          const encryptedValue = iv.toString('hex') + encrypted;
          encryptedValues[key] = encryptedValue;
        }
      }
    }
    return encryptedValues;
  }
  function isSensitiveField(key) {
    // add logic to determine which fields are sensitive
    return key === 'name' || key === 'refill';
  }
  
console.log(encryptSensitiveFields({
    name:"name of patient ajsdakgsjdgajshgdkagsdkajgsdquweioasknxcasdasjdhiqweihaklshdlahsdiqwoyrisjdanm,bcalsgdiqowgiryaishdddddddddddddddddddddddddddddddalskjhdaiwohqoiwyerrrrrrrrrrrrrrrrrrrrrrrrrrr"
}))