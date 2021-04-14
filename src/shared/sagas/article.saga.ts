import { takeLatest, call, put } from 'redux-saga/effects';

import { apiService } from '../services';
import { ArticlePaginatedModel } from '../models';
import {
  GET_GLOBAL_ARTICLES_START,
  GET_ARTICLES_IN_FEED_START,
} from '../constants/action-types';
import {
  GetGlobalArticlesStartAction,
  getGlobalArticlesSucceeded,
  getGlobalArticlesFailed,
  GetArticlesInFeedStartAction,
  getArticlesInFeedSucceeded,
  getArticlesInFeedFailed,
} from '../actions';

function* getGlobalArticles(action: GetGlobalArticlesStartAction) {
  try {
    // call() instructs the middleware to call a function with some args
    const data: ArticlePaginatedModel = yield call(
      apiService.article.getGlobalArticles,
      action.payload.params
    );
    // put() instructs the middleware to dispatch an action to the Store
    yield put(getGlobalArticlesSucceeded(data));
  } catch (error) {
    yield put(getGlobalArticlesFailed(error));
  }
}

function* getArticlesInFeed(action: GetArticlesInFeedStartAction) {
  try {
    const data: ArticlePaginatedModel = yield call(
      apiService.article.getArticlesInFeed,
      action.payload.params
    );
    yield put(getArticlesInFeedSucceeded(data));
  } catch (error) {
    yield put(getArticlesInFeedFailed(error));
  }
}

export default function* articleActionsWatcher() {
  // Spawns a saga
  // takeLatest() automatically cancels any previous saga task started previously if it's still running.
  yield takeLatest(GET_GLOBAL_ARTICLES_START, getGlobalArticles);
  yield takeLatest(GET_ARTICLES_IN_FEED_START, getArticlesInFeed);
}
