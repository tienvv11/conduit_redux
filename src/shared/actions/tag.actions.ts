import { AxiosError } from 'axios';

import * as reduxActionTypes from '../constants/action-types';
import { ErrorModel } from '../models';

interface GetTagsStartAction {
  type: typeof reduxActionTypes.GET_TAGS_START;
}

interface GetTagsSucceededAction {
  type: typeof reduxActionTypes.GET_TAGS_SUCCEEDED;
  payload: {
    tags: string[];
  };
}

interface GetTagsFailedAction {
  type: typeof reduxActionTypes.GET_TAGS_FAILED;
  payload: {
    error: AxiosError<ErrorModel>;
  };
}

interface UnloadTagsAction {
  type: typeof reduxActionTypes.UNLOAD_TAGS;
}

export type TagActionTypes =
  | GetTagsStartAction
  | GetTagsSucceededAction
  | GetTagsFailedAction
  | UnloadTagsAction;

export const getTagsStart = (): TagActionTypes => ({
  type: reduxActionTypes.GET_TAGS_START,
});

export const getTagsSucceeded = (tags: string[]): TagActionTypes => ({
  type: reduxActionTypes.GET_TAGS_SUCCEEDED,
  payload: {
    tags,
  },
});

export const getTagsFailed = (
  error: AxiosError<ErrorModel>
): TagActionTypes => ({
  type: reduxActionTypes.GET_TAGS_FAILED,
  payload: {
    error,
  },
});

export const unloadTags = (): TagActionTypes => ({
  type: reduxActionTypes.UNLOAD_TAGS,
});

export interface TagState {
  tags: string[];
  error?: AxiosError<ErrorModel>;
  isLoading: boolean;
}
