import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

export const DanmakuReducer = handleActions({
  PUSH_DANMAKU: (state, { payload = {} }) => {
    return {
      history: [...state.history, {
        id: state.history + 1,
        ...payload,
      }],
    };
  },
}, {
  history: [],
});

export const createRootReducer = () => {
  return combineReducers({
    danmaku: DanmakuReducer,
  });
};
