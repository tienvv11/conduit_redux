import {
  UserLoginModel,
  UserRegisterModel,
  UserAuthSuccessModel,
} from '../models';
import conduitApiInstance from './api-instance';

const postLogin = async (data: { user: UserLoginModel }) => {
  const path = '/users/login';
  const response = await conduitApiInstance.post<{
    user: UserAuthSuccessModel;
  }>(path, data);
  return response.data;
};

const postRegister = async (data: { user: UserRegisterModel }) => {
  const path = '/users';
  const response = await conduitApiInstance.post<{
    user: UserAuthSuccessModel;
  }>(path, data);
  return response.data;
};

const getCurrentUser = async () => {
  const path = '/user';
  const response = await conduitApiInstance.get<{
    user: UserAuthSuccessModel;
  }>(path);
  return response.data;
};

const isTokenExist = () => {
  return !!window.localStorage.getItem('token');
};

const getToken = () => {
  return window.localStorage.getItem('token');
};

const authorizeApp = (jwt: string) => {
  setJwtToLocalStorage(jwt);
  addJwtHeader(jwt);
};

const setJwtToLocalStorage = (jwt: string) => {
  const storage = window.localStorage;
  storage.setItem('token', jwt);
};

const addJwtHeader = (jwt: string) => {
  conduitApiInstance.interceptors.request.use((requestConfig) => {
    requestConfig.headers['Authorization'] = jwt ? `Token ${jwt}` : '';
    return requestConfig;
  });
};

const removeJwt = () => {
  window.localStorage.removeItem('token');
  conduitApiInstance.interceptors.request.use((requestConfig) => {
    requestConfig.headers['Authorization'] = '';
    return requestConfig;
  });
};

const authService = {
  isTokenExist,
  getToken,
  postLogin,
  authorizeApp,
  removeJwt,
  postRegister,
  getCurrentUser,
};

export default authService;
