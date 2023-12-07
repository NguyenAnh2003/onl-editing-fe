import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    /* No auth */
    'Content-Type': 'application/json',
  },
});

/**
 * POST and GET
 */

export const postHTTP = async (url, params = {}, options) => {
  const res = await axiosConfig.post(url, params, options).catch((e) => {
    const errorResponse = {
      data: e.response.data,
      status: e.response.status,
    };
    return Promise.reject(errorResponse);
  });
  return {
    data: res.data,
    status: res.status,
    headers: res.headers,
  };
};

export const getHTTP = async (url) => {
  const res = await axiosConfig.get(url).catch((e) => {
    const errorResponse = {
      data: e.response.data,
      status: e.response.status,
    };
    return Promise.reject(errorResponse);
  });
  return {
    data: res.data,
    status: res.status,
    headers: res.headers,
  };
};

export const deleteHTTP = async (url) => {
  const res = await axiosConfig.delete(url).catch((e) => {
    const errorResponse = {
      data: e.response.data,
      status: e.response.status,
    };
    return Promise.reject(errorResponse);
  });
  return {
    data: res.data,
    status: res.status,
    headers: res.headers,
  };
};

export default axiosConfig;
