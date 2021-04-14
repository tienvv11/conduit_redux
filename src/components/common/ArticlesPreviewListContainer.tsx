import React from 'react';
import { RouteChildrenProps } from 'react-router-dom';

import {
  ArticlePaginatedModel,
  ARTICLE_REQUEST_DEFAULT_LIMIT,
} from '../../shared/models';
import ArticlesLoading from './ArticlesLoading';
import ArticlesPreviewList from './ArticlesPreviewList';
import ArticlesPagination from './ArticlesPagination';

export default (
  props: {
    articlesPaginated: ArticlePaginatedModel;
    isLoading: boolean;
    filterByTag?: string;
    filterByAuthor?: string;
    filterByFavoritesOfUser?: string;
    isGlobal: boolean;
  } & RouteChildrenProps
) => {
  return (
    <>
      {!props.isLoading && props.articlesPaginated.articlesCount <= 0 ? (
        <div className="article-preview">No articles are here... yet.</div>
      ) : (
        <ArticlesPreviewList
          {...props}
          articles={props.articlesPaginated.articles}
        />
      )}

      <ArticlesLoading isLoading={props.isLoading} />

      <ArticlesPagination
        total={props.articlesPaginated.articlesCount}
        query={{
          limit: ARTICLE_REQUEST_DEFAULT_LIMIT,
          tag: props.filterByTag,
          author: props.filterByAuthor,
          favorited: props.filterByFavoritesOfUser,
        }}
        isGlobal={props.isGlobal}
      />
    </>
  );
};
