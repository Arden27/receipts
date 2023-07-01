// api.js
import axios from 'axios';
import store, { setAuthError, resetStore } from './redux/store';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const API = axios.create({
  baseURL: BASE_URL,
  xsrfHeaderName: "X-CSRFTOKEN",
  xsrfCookieName: "csrftoken",
  //withCredentials: true, // used to send cookies from the client to the server in cross-origin requests. 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

// Handle 401 and 403 errors
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      store.dispatch(resetStore());
      store.dispatch(setAuthError(true)); // dispatch an action to set the error flag
    }
    return Promise.reject(error);
  }
);

// login

export const registerUser = async (username, password1, password2) => {
  const { data } = await API.post(`/dj-rest-auth/registration/`, { username, password1, password2 });
  return data;
};

export const loginUser = async (username, password) => {
  const response = await API.post(`/dj-rest-auth/login/`, { username, password });
  return response;
};

export const logoutUser = async () => {
  const response = await API.post(`/dj-rest-auth/logout/`);
  return response;
};

// get

export const fetchReceipts = async () => {
  const { data } = await API.get(`/api/receipts/`);
  return data;
};

export const fetchReceiptItemsById = async (id) => {
  const { data } = await API.get(`/api/receiptitems/?receipt=${id}`);
  return data;
};

export const fetchReceiptItems = async () => {
  const { data } = await API.get(`/api/receiptitems/`);
  return data;
};

export const fetchTotalPrices = async () => {
  const { data } = await API.get(`/api/totalprices/`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await API.get(`/api/categories/`);
  return data;
};

// post

export const createCategory = async (categoryName) => {
  const { data } = await API.post(`/api/categories/`, { name: categoryName });
  return data;
};

export const createReceipt = async (receipt) => {
  const { data } = await API.post(`/api/receipts/`, receipt);
  return data;
};

export const createReceiptItem = async (receiptItem) => {
  const { data } = await API.post(`/api/receiptitems/`, receiptItem);
  return data;
};