import { ArticleModel } from '.';

export interface ArticlePaginatedModel {
  articles: ArticleModel[];
  articlesCount: number;
}
