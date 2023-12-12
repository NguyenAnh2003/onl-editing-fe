import Cookies from 'js-cookie';
/*
 * Manage cookie lib
 * using lib for managing cookie - easier than managing from scratch
 */
export const setToken = (token) => {
  /**
   *  set expiration for token
   * */
  Cookies.set('token', token, { expires: 30 });
};

export const getToken = () => {
  /* format data */
  const token = Cookies.get('token');
  return token;
};

export const deleteToken = () => {
  Cookies.remove('token');
};

/* set userId in cookie */
export const setUserId = () => {};

export const getUserId = () => {};

export const deleteUserId = () => {};
