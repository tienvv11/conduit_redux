import { AxiosError } from 'axios';

import * as reduxActionTypes from '../constants/action-types';
import {
  ErrorModel,
  ArticlesRequestFullParamsModel,
  ArticlePaginatedModel,
  ArticlesRequestFeedParamsModel,
} from '../models';

export type ArticleActionTypes =
  | GetGlobalArticlesStartAction
  | GetGlobalArticlesSucceededAction
  | GetGlobalArticlesFailedAction
  | GetArticlesInFeedStartAction
  | GetArticlesInFeedSucceededAction
  | GetArticlesInFeedFailedAction
  | UnloadArticlesAction;

export interface ArticleState {
  articlesPaginated: ArticlePaginatedModel;
  error?: AxiosError<ErrorModel>;
  isLoading: boolean;
  pageCurrent: number;
  selectedTag?: string;
}

//#region GetGlobalArticles Actions

export interface GetGlobalArticlesStartAction {
  type: typeof reduxActionTypes.GET_GLOBAL_ARTICLES_START;
  payload: {
    params: ArticlesRequestFullParamsModel;
    pageCurrent: number;
    isChangingPage: boolean;
  };
}

interface GetGlobalArticlesSucceededAction {
  type: typeof reduxActionTypes.GET_GLOBAL_ARTICLES_SUCCEEDED;
  payload: {
    articlesPaginated: ArticlePaginatedModel;
  };
}

interface GetGlobalArticlesFailedAction {
  type: typeof reduxActionTypes.GET_GLOBAL_ARTICLES_FAILED;
  payload: {
    error: AxiosError<ErrorModel>;
  };
}

export const getGlobalArticlesStart = (
  params: ArticlesRequestFullParamsModel,
  pageCurrent: number,
  isChangingPage: boolean
): ArticleActionTypes => ({
  type: reduxActionTypes.GET_GLOBAL_ARTICLES_START,
  payload: {
    params,
    pageCurrent,
    isChangingPage,
  },
});

export const getGlobalArticlesSucceeded = (
  articlesPaginated: ArticlePaginatedModel
): ArticleActionTypes => ({
  type: reduxActionTypes.GET_GLOBAL_ARTICLES_SUCCEEDED,
  payload: {
    articlesPaginated,
  },
});

export const getGlobalArticlesFailed = (
  error: AxiosError<ErrorModel>
): ArticleActionTypes => ({
  type: reduxActionTypes.GET_GLOBAL_ARTICLES_FAILED,
  payload: {
    error,
  },
});

//#endregion GetGlobalArticles Actions

//#region GetArticlesInFeed Actions

export interface GetArticlesInFeedStartAction {
  type: typeof reduxActionTypes.GET_ARTICLES_IN_FEED_START;
  payload: {
    params: ArticlesRequestFeedParamsModel;
    pageCurrent: number;
    isChangingPage: boolean;
  };
}

interface GetArticlesInFeedSucceededAction {
  type: typeof reduxActionTypes.GET_ARTICLES_IN_FEED_SUCCEEDED;
  payload: {
    articlesPaginated: ArticlePaginatedModel;
  };
}

interface GetArticlesInFeedFailedAction {
  type: typeof reduxActionTypes.GET_ARTICLES_IN_FEED_FAILED;
  payload: {
    error: AxiosError<ErrorModel>;
  };
}

export const getArticlesInFeedStart = (
  params: ArticlesRequestFeedParamsModel,
  pageCurrent: number,
  isChangingPage: boolean
): ArticleActionTypes => ({
  type: reduxActionTypes.GET_ARTICLES_IN_FEED_START,
  payload: {
    params,
    pageCurrent,
    isChangingPage,
  },
});

export const getArticlesInFeedSucceeded = (
  articlesPaginated: ArticlePaginatedModel
): ArticleActionTypes => ({
  type: reduxActionTypes.GET_ARTICLES_IN_FEED_SUCCEEDED,
  payload: {
    articlesPaginated,
  },
});

export const getArticlesInFeedFailed = (
  error: AxiosError<ErrorModel>
): ArticleActionTypes => ({
  type: reduxActionTypes.GET_ARTICLES_IN_FEED_FAILED,
  payload: {
    error,
  },
});

//#endregion GetArticlesInFeed Actions

//#region Unload Actions

interface UnloadArticlesAction {
  type: typeof reduxActionTypes.UNLOAD_ARTICLES;
}

export const unloadArticles = (): ArticleActionTypes => ({
  type: reduxActionTypes.UNLOAD_ARTICLES,
});

//#endregion Unload Actions
