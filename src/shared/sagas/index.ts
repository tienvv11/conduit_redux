import { all } from 'redux-saga/effects';

import articleActionsWatcher from './article.saga';
import authActionsWatcher from './auth.saga';
import tagActionWatcher from './tag.saga';

export default function* rootSaga() {
  yield all([
    articleActionsWatcher(),
    authActionsWatcher(),
    tagActionWatcher(),
  ]);
}
