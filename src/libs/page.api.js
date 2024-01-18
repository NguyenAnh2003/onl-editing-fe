/**
 * No authenticate
 * features: create space by spaceId
 * fetch data MongoDB display list Spaces
 * delete space by spaceId
 *
 * Create, delete, get space using REST
 */

import { postHTTP, getHTTP, deleteHTTP, putHTTP } from '../config/api.config';

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

/** getColbPages byUserId */
export const getColabPages = (userId) => {
  const res = getHTTP(`/get-colab-pages/${userId}`);
  return res;
};

export const getColabsByPageId = (pageId) => {
  const res = getHTTP(`/get-colab-pages-pageid/${pageId}`);
  return res;
};

/** getColabDataByUserIdAndPageId */
export const getOneColabPage = (userId, pageId) => {
  const res = getHTTP(`/get-one-colab-page/${userId}/${pageId}`);
  return res;
};

/** createSpace REST*/
export const createSpace = (userId, pageName) => {
  const res = postHTTP('/create-page', { userId, pageName });
  return res;
};

/** deleteSpace */
export const deletePage = (pageId) => {
  const res = deleteHTTP(`/delete-page/${pageId}`);
  return res;
};

/** update page name */
export const updatePageName = (pageId, name) => {
  const res = putHTTP(`/update-page-name/${pageId}`, { name });
  return res;
};

/** delete from colab */
export const deleteUserColab = (colabId) => {
  const res = deleteHTTP(`/delete-user-colab/${colabId}`);
  return res;
};

/** add user to page */
export const addUserToPage = (userId, pageId, username) => {
  const res = postHTTP('/add-user-to-page', { userId, pageId, username });
  return res;
};

/** update user mode in colab */
export const updateUserMode = (colabId, userId, pageId, mode, username) => {
  /** specific colabId
   * body userId, pageId, mode, username
   */
  const res = putHTTP(`/update-user-mode/${colabId}`, { userId, pageId, mode, username });
  return res;
};
