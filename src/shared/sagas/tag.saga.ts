import { put, takeLeading, call } from 'redux-saga/effects';

import { getTagsSucceeded, getTagsFailed } from '../actions';
import { apiService } from '../services';
import { TagsModel } from '../models';
import { GET_TAGS_START } from '../constants/action-types';

function* getTags() {
  try {
    const data: TagsModel = yield call(apiService.tag.getTags);
    yield put(getTagsSucceeded(data.tags));
  } catch (error) {
    yield put(getTagsFailed(error));
  }
}

// This watches for any GET_TAGS_START action
export default function* tagActionsWatcher() {
  yield takeLeading(GET_TAGS_START, getTags);
}
