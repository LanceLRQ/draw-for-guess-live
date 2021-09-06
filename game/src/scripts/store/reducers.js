import { pick } from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

export const DanmakuReducer = handleActions({
  PUSH_DANMAKU: (state, { payload = {} }) => {
    return {
      ...state,
      history: [...state.history, {
        id: state.history.length + 1,
        ...payload,
      }],
    };
  },
  PUSH_DANMAKU_CURRENT: (state, { payload = {} }) => {
    return {
      ...state,
      current: [{
        id: state.current.length + 1,
        ...payload,
      }, ...state.current],
    };
  },
  // 批量导入弹幕
  PUSH_DANMAKU_BATCH: (state, { payload = {} }) => {
    const rel = [...state[payload.type]];
    if (payload.type === 'global') {
      payload?.list.forEach((item) => {
        rel.push({
          id: rel.length + 1,
          ...item,
        });
      });
    } else { // current为向前插入
      payload?.list.forEach((item) => {
        rel.unshift({
          id: rel.length + 1,
          ...item,
        });
      });
    }
    return {
      ...state,
      [payload.type]: rel,
    };
  },
}, {
  history: [],
  current: [],
});

export const GameStatusReducer = handleActions({
  SAVE_CURRENT_RIDDLE: (state, { payload = {} }) => {
    return {
      ...state,
      init: true,
      ...payload,
    };
  },
}, {
  init: false,
  current_id: 0,
  current_riddle: null,
  drawing_history: [],
});

export const createRootReducer = () => {
  return combineReducers({
    danmaku: DanmakuReducer,
    game_status: GameStatusReducer,
  });
};
