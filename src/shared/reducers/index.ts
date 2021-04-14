import { combineReducers } from 'redux';

import article from './article.reducer';
import auth from './auth.reducer';
import tag from './tag.reducer';

export const rootReducer = combineReducers({
  article,
  auth,
  tag,
});

export type RootState = ReturnType<typeof rootReducer>;
