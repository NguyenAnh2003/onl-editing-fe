import { postHTTP } from '../config/api.config';

export const userLogin = async (name, password) => {
  const res = postHTTP('login', {
    name,
    password,
  });
  return res;
};

export const userRegister = async (name, password) => {
  const res = postHTTP('register', {
    name,
    password,
  });
  return res;
};
