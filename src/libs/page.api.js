/**
 * No authenticate
 * features: create space by spaceId
 * fetch data MongoDB display list Spaces
 * delete space by spaceId
 *
 * Create, delete, get space using REST
 */

import { postHTTP, getHTTP, deleteHTTP } from '../config/api.config';

/** getPages */
export const getDataByPageId = (pageId) => {
  const res = getHTTP(`/get-page/${pageId}`);
  return res;
};

/** getPagesByUserId REST*/
export const getPagesByUserId = (userId) => {
  const res = getHTTP(`/get-pages/${userId}`);
  return res;
};

/** getColbPages */
export const getColabPages = (userId) => {
  const res = getHTTP(`/get-colab-pages/${userId}`);
  return res;
};

/** createSpace REST*/
export const createSpace = (userId, pageName) => {
  const res = postHTTP('/create-page', { userId, pageName });
  return res;
};

/** deleteSpace */
export const deleteSpace = (pageId) => {
  const res = deleteHTTP(`/delete/${pageId}`);
  return res;
};

/** add user to page */
export const addUserToPage = (userId, pageId) => {
  const res = postHTTP('/add-user-to-page', { userId, pageId });
  return res;
};
