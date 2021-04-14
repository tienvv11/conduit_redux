import articleService from './article.service';
import authService from './auth.service';
import editorService from './editor.service';
import settingService from './setting.service';
import tagService from './tag.service';
import profileService from './profile.service';

export const apiService = {
  article: articleService,
  auth: authService,
  editor: editorService,
  profile: profileService,
  setting: settingService,
  tag: tagService,
};
