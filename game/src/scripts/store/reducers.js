import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

export const TestReducer = handleActions({
  SET_COUNTER: (state, { payload = {} }) => {
    return {
      counter: payload.counter,
    };
  },
}, {
  counter: 0,
});

export const createRootReducer = () => {
  return combineReducers({
    test: TestReducer,
  });
};
