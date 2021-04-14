import conduitApiInstance from './api-instance';
import {
  ArticlePaginatedModel,
  ArticlesRequestFullParamsModel,
  ArticlesRequestFeedParamsModel,
  ArticleModel,
  CommentsModel,
  PostCommentModel,
} from '../models';
import { toURLSearchParams } from '../utils';

const getGlobalArticles = async (params: ArticlesRequestFullParamsModel) => {
  const queryParams = toURLSearchParams(params);
  const path = `/articles${queryParams}`;
  const response = await conduitApiInstance.get<ArticlePaginatedModel>(path);
  return response.data;
};

const getArticle = async (slug: string) => {
  const path = `/articles/${slug}`;
  const response = await conduitApiInstance.get<{ article: ArticleModel }>(
    path
  );
  return response.data;
};

const getArticlesInFeed = async (params: ArticlesRequestFeedParamsModel) => {
  const queryParams = toURLSearchParams(params);
  const path = `/articles/feed${queryParams}`;
  const response = await conduitApiInstance.get<ArticlePaginatedModel>(path);
  return response.data;
};

const postFavoriteArticle = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const path = `/articles/${encodedSlug}/favorite`;
  const response = await conduitApiInstance.post<{ article: ArticleModel }>(
    path
  );
  return response.data;
};

const unfavoriteArticle = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const path = `/articles/${encodedSlug}/favorite`;
  const response = await conduitApiInstance.delete<{ article: ArticleModel }>(
    path
  );
  return response.data;
};

const getComments = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const path = `/articles/${encodedSlug}/comments`;
  const response = await conduitApiInstance.get<CommentsModel>(path);
  return response.data;
};

const postComment = async (slug: string, data: PostCommentModel) => {
  const encodedSlug = encodeURIComponent(slug);
  const path = `/articles/${encodedSlug}/comments`;
  const response = await conduitApiInstance.post<{
    postComment: PostCommentModel;
  }>(path, data);
  return response.data;
};

const deleteComment = async (slug: string, id: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const path = `/articles/${encodedSlug}/comments/${id}`;
  const response = await conduitApiInstance.delete(path);
  return response.data;
};

const deleteArticle = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const path = `/articles/${encodedSlug}`;
  const response = await conduitApiInstance.delete(path);
  return response.data;
};

const articleService = {
  getGlobalArticles,
  getArticle,
  getArticlesInFeed,
  postFavoriteArticle,
  unfavoriteArticle,
  getComments,
  postComment,
  deleteComment,
  deleteArticle,
};

export default articleService;
