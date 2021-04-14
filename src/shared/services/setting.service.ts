import {
  UserSettingModel,
  UserAuthSuccessModel,
} from '../models';
import conduitApiInstance from './api-instance';

const putSetting = async (data: { user: UserSettingModel }) => {
  const path = '/user';
  const response = await conduitApiInstance.put<{
    user: UserAuthSuccessModel;
  }>(path, data);
  return response.data;
};

const settingService = {
  putSetting,
};

export default settingService;
