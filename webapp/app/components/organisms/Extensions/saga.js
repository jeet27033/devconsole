import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';
import { makeSelectFetchingExtensions } from './selectors';
import { toErrorMessage } from '../../../helper/sagaHelper';
import * as constants from '../../pages/App/constants';

const { SUCCESS, REQUEST } = constants;

function* getExtensionsList() {
  // Skip if already loaded or currently loading
  const fetchingExtensions = yield select(makeSelectFetchingExtensions());
  if (fetchingExtensions === SUCCESS || fetchingExtensions === REQUEST) return;

  try {
    const res = yield call(Api.getExtensionsList);
    if (res?.success) {
      yield put({
        type: actionTypes.GET_EXTENSIONS_LIST_SUCCESS,
        data: res.result,
      });
    } else {
      yield put({
        type: actionTypes.GET_EXTENSIONS_LIST_FAILURE,
        error: toErrorMessage(res, 'Failed to fetch extensions list'),
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_EXTENSIONS_LIST_FAILURE,
      error,
    });
  }
}

function* watchGetExtensionsList() {
  yield takeLatest(actionTypes.GET_EXTENSIONS_LIST_REQUEST, getExtensionsList);
}

export default [watchGetExtensionsList];
