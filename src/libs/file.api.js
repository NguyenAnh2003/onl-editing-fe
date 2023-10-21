/**
 * upload file using REST -> get props file
 * -> create space -> fetch space
 */

import { postHTTP } from '../config/api.config';

/** upload file including spaceId */
export const uploadFile = (spaceId, file) => {
  const res = postHTTP('/url', { spaceId, file });
  return res;
};
