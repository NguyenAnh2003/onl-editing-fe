/**
 * upload file using REST -> get props file
 * -> create space -> fetch space
 */

import { postHTTP } from '../config/api.config';

/** upload file including spaceId */
export const exportPDF = (delta, filename) => {
  const res = postHTTP('/pdf-export', { delta, filename });
  return res;
};