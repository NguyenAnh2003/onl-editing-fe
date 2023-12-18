/**
 * upload file using REST -> get props file
 * -> create space -> fetch space
 */

import { postHTTP } from '../config/api.config';
import { encryptHelper } from './utils';

/** upload file including spaceId */
export const exportPDF = (delta, filename) => {
  const encryptedRequest = encryptHelper({ delta, filename });
  const res = postHTTP('/pdf-export', { encryptedRequest });
  return res;
};
