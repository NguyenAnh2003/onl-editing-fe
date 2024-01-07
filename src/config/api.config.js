import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    /* No auth */
    'Content-Type': 'application/json',
  },
});

axiosConfig.interceptors.request.use(
  (config) => {
    if (config.url.includes('/upload')) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (err) => {
    return err;
  }
);

axiosConfig.interceptors.response.use(
  (config) => {
    const responseData = {
      data: config.data,
      status: config.status,
      headers: config.headers,
    };
    return responseData;
  },
  (err) => {
    const errorResponse = {
      data: err.response.data,
      status: err.response.status,
      headers: err.response.headers,
    };
    return errorResponse;
  }
);

/**
 * POST and GET
 */

export const postHTTP = async (url, params = {}) => {
  const res = await axiosConfig.post(url, params);
  return res;
};

export const getHTTP = async (url) => {
  const res = await axiosConfig.get(url);
  return res;
};

export const putHTTP = async (url, params = {}) => {
  const res = await axiosConfig.put(url, params);
  return res;
};

export const deleteHTTP = async (url) => {
  const res = await axiosConfig.delete(url);
  return res;
};

export default axiosConfig;
