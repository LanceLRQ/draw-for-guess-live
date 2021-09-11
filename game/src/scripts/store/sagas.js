import { createActions } from 'redux-actions';
import { put, takeEvery } from 'redux-saga/effects';
import { pick } from 'lodash';
import { API } from '@/scripts/views/logic/api';

export const {
  pushDanmaku,
  pushDanmakuCurrent,
  pushDanmakuBatch,
  clearDanmakuBatch,
  initGameStatus,
  saveCurrentRiddle,
  getRiddleList,
  saveRiddleList,
  addRiddle,
  editRiddle,
  deleteRiddle,
  changeCurrentRiddle,
  updateGameStatus,
} = createActions({
  PUSH_DANMAKU: (payloads) => payloads,
  PUSH_DANMAKU_CURRENT: (payloads) => payloads,
  PUSH_DANMAKU_BATCH: (payloads) => payloads,
  CLEAR_DANMAKU_BATCH: (payloads) => payloads,
  INIT_GAME_STATUS: (payloads) => payloads,
  SAVE_CURRENT_RIDDLE: (payloads) => payloads,
  GET_RIDDLE_LIST: (payloads) => payloads,
  SAVE_RIDDLE_LIST: (payloads) => payloads,
  ADD_RIDDLE: (payloads) => payloads,
  EDIT_RIDDLE: (payloads) => payloads,
  DELETE_RIDDLE: (payloads) => payloads,
  CHANGE_CURRENT_RIDDLE: (payloads) => payloads,
  UPDATE_GAME_STATUS: (payloads) => payloads,
});

function* initGameStatusSaga() {
  try {
    const resp = yield API.Dashboard.GetGameStatus({});
    yield put(saveCurrentRiddle(pick(resp?.data?.data, ['current_id', 'current_riddle', 'drawing_history'])));
    yield put(pushDanmakuBatch({
      type: 'current',
      list: resp?.data?.data?.current_danmaku,
    }));
  } catch (err) {
    console.error(err);
  }
}

function* getRiddleListSaga() {
  try {
    const resp = yield API.Dashboard.GetRiddleList({});
    yield put(saveRiddleList(resp?.data?.data?.riddle_list));
  } catch (err) {
    console.error(err);
  }
}

function* addRiddleSaga({ payload }) {
  try {
    const resp = yield API.Dashboard.addRiddle(payload.data);
    payload.onSuccess && payload.onSuccess(resp.data);
  } catch (err) {
    payload.onError && payload.onError(err);
  } finally {
    payload.onCompleted && payload.onCompleted();
  }
}

function* editRiddleSaga({ payload }) {
  try {
    const resp = yield API.Dashboard.editRiddle(payload.data);
    payload.onSuccess && payload.onSuccess(resp.data);
  } catch (err) {
    payload.onError && payload.onError(err);
  } finally {
    payload.onCompleted && payload.onCompleted();
  }
}

function* deleteRiddleSaga({ payload }) {
  try {
    yield API.Dashboard.deleteRiddle(payload.data);
    payload.onSuccess && payload.onSuccess();
  } catch (err) {
    payload.onError && payload.onError(err);
  } finally {
    payload.onCompleted && payload.onCompleted();
  }
}

function* changeCurrentRiddleSaga({ payload }) {
  try {
    yield API.Dashboard.changeCurrentRiddle(payload.data);
    // yield put(updateGameStatus(resp?.data?.data));
    yield put(clearDanmakuBatch({ type: 'current' }));
    payload.onSuccess && payload.onSuccess();
  } catch (err) {
    payload.onError && payload.onError(err);
  } finally {
    payload.onCompleted && payload.onCompleted();
  }
}

export function* rootSaga() {
  yield takeEvery([initGameStatus], initGameStatusSaga);
  yield takeEvery([getRiddleList], getRiddleListSaga);
  yield takeEvery([addRiddle], addRiddleSaga);
  yield takeEvery([editRiddle], editRiddleSaga);
  yield takeEvery([deleteRiddle], deleteRiddleSaga);
  yield takeEvery([changeCurrentRiddle], changeCurrentRiddleSaga);
}
