import { createActions } from 'redux-actions';
import { put, takeEvery } from 'redux-saga/effects';

const {
  setCounter,
  updateCounter,
} = createActions({
  SET_COUNTER: (payloads) => payloads,
  UPDATE_COUNTER: (payloads) => payloads,
});

function* updateCounterSaga({ payload }) {
  yield put(setCounter(payload));
}

export function* rootSaga() {
  yield takeEvery([updateCounter], updateCounterSaga);
}

export default {
  updateCounter,
};
