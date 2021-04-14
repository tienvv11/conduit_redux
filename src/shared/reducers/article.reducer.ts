import { ArticleState, ArticleActionTypes } from '../actions';
import * as reduxActionTypes from '../constants/action-types';

const defaultArticleState: ArticleState = {
  articlesPaginated: { articles: [], articlesCount: 0 },
  isLoading: false,
  pageCurrent: 1,
};

export default (
  state: ArticleState = { ...defaultArticleState },
  action: ArticleActionTypes
): ArticleState => {
  switch (action.type) {
    case reduxActionTypes.GET_GLOBAL_ARTICLES_START:
      return {
        articlesPaginated: action.payload.isChangingPage
          ? state.articlesPaginated // Keep the existing articles and keep the pagination controls for now
          : defaultArticleState.articlesPaginated, // Clear the list and hide pagination controls
        isLoading: true,
        pageCurrent: action.payload.pageCurrent,
        selectedTag: action.payload.params.tag,
      };

    case reduxActionTypes.GET_ARTICLES_IN_FEED_START:
      return {
        articlesPaginated: action.payload.isChangingPage
          ? state.articlesPaginated
          : defaultArticleState.articlesPaginated,
        isLoading: true,
        pageCurrent: action.payload.pageCurrent,
        selectedTag: undefined,
      };

    case reduxActionTypes.GET_GLOBAL_ARTICLES_SUCCEEDED:
    case reduxActionTypes.GET_ARTICLES_IN_FEED_SUCCEEDED:
      return {
        articlesPaginated: action.payload.articlesPaginated,
        isLoading: false,
        pageCurrent: state.pageCurrent,
        selectedTag: state.selectedTag,
      };

    case reduxActionTypes.GET_GLOBAL_ARTICLES_FAILED:
    case reduxActionTypes.GET_ARTICLES_IN_FEED_FAILED:
      return {
        ...defaultArticleState,
        error: action.payload.error,
      };

    case reduxActionTypes.UNLOAD_ARTICLES:
      return { ...defaultArticleState };

    default:
      return state;
  }
};
