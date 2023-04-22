const Sequelize = require("sequelize");
const sequelize = require("./index");
const crypto=require('crypto')
const Patieninfo = sequelize.define("patient_info", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  prescription:{
   type:Sequelize.STRING,
  },
  refill:{
    type:Sequelize.STRING,
  }
},
  {
    hooks: {
      beforeCreate: (patient, options) => {
        encryptSensitiveFields(patient);
      },
      beforeUpdate: (patient, options) => {
        encryptSensitiveFields(patient);
      },
      afterFind: (patient, options) => {
        decryptSensitiveFields(patient);
      },
    },
}
);


function encryptSensitiveFields(patient) {
  for (const key in patient.dataValues) {
    if (isSensitiveField(key)) {
      const value = patient.dataValues[key];
      if (value) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY,iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const encryptedValue = iv.toString('hex') + encrypted;
        patient.setDataValue(key, encryptedValue);
      }
    }
  }
}

function decryptSensitiveFields(patients) {
  const iterateDecryption=(patient)=>{
    for (const key in patient.dataValues) {
      if (isSensitiveField(key)) {
        const value = patient.dataValues[key];
        if (value) {
          const iv = Buffer.from(value.slice(0, 32), 'hex');
          const encrypted = Buffer.from(value.slice(32), 'hex');
          const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, iv);
          let decrypted = decipher.update(encrypted, 'hex', 'utf8');
          decrypted += decipher.final('utf8');
          patient.setDataValue(key, decrypted);
        }
      }
    }
  }
  if(Array.isArray(patients)){
  for(const patient of patients){
   iterateDecryption(patient)
  }
}
  else{
   iterateDecryption(patients)
  }
}

function isSensitiveField(key) {
  // add logic to determine which fields are sensitive
  return key === 'prescription' || key === 'refill';
}

module.exports = Patieninfo ;
