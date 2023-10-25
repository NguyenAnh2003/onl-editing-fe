/**
 * No authenticate
 * features: create space by spaceId
 * fetch data MongoDB display list Spaces
 * delete space by spaceId
 *
 * Create, delete, get space using REST
 */

import { postHTTP, getHTTP, deleteHTTP } from '../config/api.config';

/** getSpace */
export const getSpace = (userId) => {
  const res = getHTTP(`${userId}`);
  return res;
};

/** createSpace */
export const createSpace = (spaceId) => {
  const res = postHTTP('/url', spaceId);
  return res;
};

/** deleteSpace */
export const deleteSpace = (spaceId) => {
  const res = deleteHTTP(`${spaceId}`);
  return res;
};
