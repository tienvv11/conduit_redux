export interface ArticleRequestModel {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}

export interface ArticlesRequestFeedParamsModel {
  limit: number;
  offset: number;
}

export interface ArticlesRequestFullParamsModel
  extends ArticlesRequestFeedParamsModel {
  tag?: string;
  author?: string;
  favorited?: string;
}

export const ARTICLE_REQUEST_DEFAULT_LIMIT = 20;
