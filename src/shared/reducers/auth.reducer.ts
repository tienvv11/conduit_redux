import { AuthState, AuthActionTypes } from '../actions';
import * as reduxActionTypes from '../constants/action-types';

const defaultAuthState: AuthState = {
  userInfo: {
    id: 0,
    email: '',
    username: '',
    token: '',
    bio: null,
    image: null,
  },
};

export default (
  state = defaultAuthState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case reduxActionTypes.LOGIN_SUCCEEDED:
    case reduxActionTypes.REGISTER_SUCCEEDED:
    case reduxActionTypes.GET_CURRENT_USER_SUCCEEDED:
      return {
        userInfo: action.payload.user,
      };

    case reduxActionTypes.LOGOUT_SUCCEEDED:
      return {
        ...defaultAuthState,
      };

    case reduxActionTypes.GET_CURRENT_USER_FAILED:
      return {
        ...defaultAuthState,
        error: action.payload.error,
      };

    case reduxActionTypes.GET_CURRENT_USER_START:
    default:
      return state;
  }
};
