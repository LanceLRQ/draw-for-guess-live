import { createActions } from 'redux-actions';
// import { put, takeEvery } from 'redux-saga/effects';

export const {
  pushDanmaku,
  updateCounter,
} = createActions({
  PUSH_DANMAKU: (payloads) => payloads,
  UPDATE_COUNTER: (payloads) => payloads,
});

// function* updateCounterSaga({ payload }) {
//   yield put(setCounter(payload));
// }

export function* rootSaga() {
  // yield takeEvery([updateCounter], updateCounterSaga);
}
