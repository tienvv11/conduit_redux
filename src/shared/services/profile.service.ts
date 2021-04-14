import conduitApiInstance from './api-instance';
import { ProfileModel } from '../models';

const postFollow = async (username: string) => {
  const encodedUsername = encodeURIComponent(username);
  const path = `/profiles/${encodedUsername}/follow`;
  const response = await conduitApiInstance.post<{ profile: ProfileModel }>(
    path
  );
  return response.data;
};

const unFollow = async (username: string) => {
  const encodedUsername = encodeURIComponent(username);
  const path = `/profiles/${encodedUsername}/follow`;
  const response = await conduitApiInstance.delete<{ profile: ProfileModel }>(
    path
  );
  return response.data;
};

const getProfile = async (username: string) => {
  const encodedUsername = encodeURIComponent(username);
  const path = `/profiles/${encodedUsername}`;
  const response = await conduitApiInstance.get<{ profile: ProfileModel }>(
    path
  );
  return response.data;
};

const profileService = {
  postFollow,
  unFollow,
  getProfile,
};

export default profileService;
