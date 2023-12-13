import { getHTTP, postHTTP } from '../config/api.config';
import { encryptHelper } from './utils';

export const userLogin = async (name, password) => {
  const encryptedData = encryptHelper({ name, password });
  const res = postHTTP('/login', {
    encryptedData,
  });
  return res;
};

export const userRegister = async (name, password) => {
  const encryptedData = encryptHelper({ name, password });
  const res = postHTTP('/register', {
    encryptedData,
  });
  return res;
};

export const searchUser = async (name) => {
  const res = getHTTP(`search-user/${name}`);
  return res;
};
