/**
 * upload file using REST -> get props file
 * -> create space -> fetch space
 */

import { postHTTP } from '../config/api.config';

/** upload file including spaceId */
export const exportPDF = (delta) => {
  const res = postHTTP('/url', { delta });
  return res;
};
