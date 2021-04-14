import { put, takeLeading, call } from 'redux-saga/effects';

import { getCurrentUserSucceeded, getCurrentUserFailed } from '../actions';
import { apiService } from '../services';
import { UserAuthSuccessModel } from '../models';
import { GET_CURRENT_USER_START } from '../constants/action-types';

function* getCurrentUser() {
  try {
    const responseData: {
      user: UserAuthSuccessModel;
    } = yield call(apiService.auth.getCurrentUser);

    const authenticatedUser = responseData.user;
    apiService.auth.authorizeApp(authenticatedUser.token);

    yield put(getCurrentUserSucceeded(authenticatedUser));
  } catch (error) {
    yield put(getCurrentUserFailed(error));
  }
}

export default function* authActionsWatcher() {
  yield takeLeading(GET_CURRENT_USER_START, getCurrentUser);
}
