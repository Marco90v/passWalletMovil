import cryptoJs from "react-native-crypto-js";

const encrypt = (data,pass) => cryptoJs.AES.encrypt(JSON.stringify(data.data), pass);

const decrypt = (data,pass) => cryptoJs.AES.decrypt(data.data, pass).toString(cryptoJs.enc.Utf8);

export {encrypt, decrypt}
