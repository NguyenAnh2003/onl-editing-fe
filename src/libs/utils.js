import CryptoJS from 'crypto-js';
/** crypto */

export const encryptHelper = (params = {}) => {
  try {
    if (params) {
      const cipherText = CryptoJS.AES.encrypt(
        JSON.stringify(params),
        import.meta.env.VITE_SECRET_KEY
      ).toString();
      return cipherText;
    }
  } catch (error) {
    console.error(error);
  }
};

export const decryptHelper = (encryptedData) => {
  if (encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.VITE_SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      console.error(error);
    }
  }
};
