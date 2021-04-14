import React from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';

import { ArticleModel } from '../../shared/models';
import { DEFAULT_PROFILE_IMG } from '../../shared/constants/defaults';
import { formatDate } from '../../shared/utils';
import ArticlePreviewFavoriteButton from './ArticlePreviewFavoriteButton';

export default (props: { articles: ArticleModel[] } & RouteChildrenProps) => {
  return (
    <>
      {props.articles.map((article) => (
        <div key={article.slug} className="article-preview">
          <div className="article-meta">
            <Link to={`/profile/@${article.author.username}`}>
              <img
                src={article.author.image ?? DEFAULT_PROFILE_IMG}
                alt={article.author.username}
              />
            </Link>
            <div className="info">
              <Link
                to={`/profile/@${article.author.username}`}
                className="author">
                {article.author.username}
              </Link>
              <span className="date">{formatDate(article.createdAt)}</span>
            </div>
            <ArticlePreviewFavoriteButton {...props} initialArticle={article} />
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            {article.tagList.length > 0 && (
              <ArticlePreviewTagList tags={article.tagList} />
            )}
          </Link>
        </div>
      ))}
    </>
  );
};

const ArticlePreviewTagList = (props: { tags: string[] }) => {
  return (
    <ul className="tag-list">
      {props.tags.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className="tag-default tag-pill tag-outline">
          {tag}
        </li>
      ))}
    </ul>
  );
};
