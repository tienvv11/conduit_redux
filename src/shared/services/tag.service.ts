import conduitApiInstance from './api-instance';
import { TagsModel } from '../models';

const getTags = async () => {
  const path = '/tags';
  const response = await conduitApiInstance.get<TagsModel>(path);
  return response.data;
};

const tagService = {
  getTags,
};

export default tagService;
