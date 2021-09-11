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
    payload?.list.forEach((item) => {
      rel.push({
        id: rel.length + 1,
        ...item,
      });
    });
    return {
      ...state,
      [payload.type]: rel,
    };
  },
  // 清空弹幕
  CLEAR_DANMAKU_BATCH: (state, { payload = {} }) => {
    return {
      ...state,
      [payload.type]: [],
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
  UPDATE_GAME_STATUS: (state, { payload = {} }) => {
    return {
      ...state,
      current_id: payload.current_id,
      current_riddle: payload.current_riddle,
      drawing_history: [],
    };
  },
}, {
  init: false,
  current_id: 0,
  current_riddle: null,
  drawing_history: [],
});

export const RiddleReducer = handleActions({
  SAVE_RIDDLE_LIST: (state, { payload = [] }) => {
    return {
      ...state,
      list: payload,
    };
  },
}, {
  list: [],
});

export const createRootReducer = () => {
  return combineReducers({
    danmaku: DanmakuReducer,
    game_status: GameStatusReducer,
    riddles: RiddleReducer,
  });
};
