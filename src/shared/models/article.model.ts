import { ProfileModel } from '.';

export interface ArticleModel {
  title: string;
  slug: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  description: string;
  author: ProfileModel;
  favorited: boolean;
  favoritesCount: number;
}
