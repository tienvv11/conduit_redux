import { TagState, TagActionTypes } from '../actions';
import * as reduxActionTypes from '../constants/action-types';

/**
 * The default state is: No tags, not loading.
 */
const defaultTagState: TagState = {
  tags: [],
  isLoading: false,
};

export default (
  state: TagState = { ...defaultTagState },
  action: TagActionTypes
): TagState => {
  switch (action.type) {
    case reduxActionTypes.GET_TAGS_START:
      return {
        ...defaultTagState,
        isLoading: true,
      };

    case reduxActionTypes.GET_TAGS_SUCCEEDED:
      return {
        ...defaultTagState,
        tags: action.payload.tags,
      };

    case reduxActionTypes.GET_TAGS_FAILED:
      return {
        ...defaultTagState,
        error: action.payload.error,
      };

    case reduxActionTypes.UNLOAD_TAGS:
      return { ...defaultTagState };

    default:
      return state;
  }
};
