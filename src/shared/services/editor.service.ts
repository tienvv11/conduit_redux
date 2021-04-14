import conduitApiInstance from './api-instance';
import { ArticleRequestModel, ArticleModel } from '../models';

const postEditor = async (data: ArticleRequestModel) => {
  const path = '/articles';
  const response = await conduitApiInstance.post<{ article: ArticleModel }>(
    path,
    data
  );
  return response.data;
};

const putEditor = async (slug: string, data: ArticleRequestModel) => {
  const path = `articles/${slug}`;
  const response = await conduitApiInstance.put<{ article: ArticleModel }>(
    path,
    data
  );
  return response.data;
};

const editorService = {
  postEditor,
  putEditor,
};

export default editorService;
