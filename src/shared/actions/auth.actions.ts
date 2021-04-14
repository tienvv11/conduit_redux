import { AxiosError } from 'axios';

import * as reduxActionTypes from '../constants/action-types';
import { UserAuthSuccessModel, ErrorModel } from '../models';

export type AuthActionTypes =
  | LoginSucceededAction
  | RegisterSucceededAction
  | LogoutSucceededAction
  | GetCurrentUserStartAction
  | GetCurrentUserSucceededAction
  | GetCurrentUserFailedAction;

export interface AuthState {
  userInfo: UserAuthSuccessModel;
  error?: AxiosError<ErrorModel>;
}

//#region Login Actions

interface LoginSucceededAction {
  type: typeof reduxActionTypes.LOGIN_SUCCEEDED;
  payload: {
    user: UserAuthSuccessModel;
  };
}

export const loginSucceeded = (user: UserAuthSuccessModel): AuthActionTypes => {
  return {
    type: reduxActionTypes.LOGIN_SUCCEEDED,
    payload: {
      user: { ...user },
    },
  };
};

//#endregion Login Actions

//#region Register Actions

interface RegisterSucceededAction {
  type: typeof reduxActionTypes.REGISTER_SUCCEEDED;
  payload: {
    user: UserAuthSuccessModel;
  };
}

export const registerSucceeded = (
  user: UserAuthSuccessModel
): AuthActionTypes => {
  return {
    type: reduxActionTypes.REGISTER_SUCCEEDED,
    payload: {
      user: { ...user },
    },
  };
};

//#endregion Register Actions

//#region Logout Actions

interface LogoutSucceededAction {
  type: typeof reduxActionTypes.LOGOUT_SUCCEEDED;
}

export const logoutSucceeded = (): AuthActionTypes => ({
  type: reduxActionTypes.LOGOUT_SUCCEEDED,
});

//#endregion Logout Actions

//#region GetCurrentUser Actions

interface GetCurrentUserStartAction {
  type: typeof reduxActionTypes.GET_CURRENT_USER_START;
}

interface GetCurrentUserSucceededAction {
  type: typeof reduxActionTypes.GET_CURRENT_USER_SUCCEEDED;
  payload: {
    user: UserAuthSuccessModel;
  };
}

interface GetCurrentUserFailedAction {
  type: typeof reduxActionTypes.GET_CURRENT_USER_FAILED;
  payload: {
    error: AxiosError<ErrorModel>;
  };
}

export const getCurrentUserStart = (): AuthActionTypes => ({
  type: reduxActionTypes.GET_CURRENT_USER_START,
});

export const getCurrentUserSucceeded = (
  user: UserAuthSuccessModel
): AuthActionTypes => ({
  type: reduxActionTypes.GET_CURRENT_USER_SUCCEEDED,
  payload: {
    user,
  },
});

export const getCurrentUserFailed = (
  error: AxiosError<ErrorModel>
): AuthActionTypes => ({
  type: reduxActionTypes.GET_CURRENT_USER_FAILED,
  payload: {
    error,
  },
});

//#endregion GetCurrentUser Actions
