import { call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';
import { toErrorMessage } from '../../../helper/sagaHelper';

function* getOrgDBs() {
  try {
    const res = yield call(Api.getOrgDBs);
    if (res?.success) {
      yield put({ type: actionTypes.GET_ORG_DBS_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_ORG_DBS_FAILURE, error: toErrorMessage(res, 'Failed to fetch databases') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_ORG_DBS_FAILURE, error: toErrorMessage(error, 'Failed to fetch databases') });
  }
}

function* getDBCollections(action) {
  try {
    const res = yield call(Api.getDBCollections, { db: action.payload.db });
    if (res?.success) {
      yield put({ type: actionTypes.GET_DB_COLLECTIONS_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_DB_COLLECTIONS_FAILURE, error: toErrorMessage(res, 'Failed to fetch collections') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_DB_COLLECTIONS_FAILURE, error: toErrorMessage(error, 'Failed to fetch collections') });
  }
}

function* executeMongoQuery(action) {
  try {
    const res = yield call(Api.executeMongoQuery, { db: action.payload.db, query: action.payload.query });
    if (res?.success) {
      yield put({ type: actionTypes.EXECUTE_MONGO_QUERY_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.EXECUTE_MONGO_QUERY_FAILURE, error: toErrorMessage(res, 'Query failed') });
    }
  } catch (error) {
    yield put({ type: actionTypes.EXECUTE_MONGO_QUERY_FAILURE, error: toErrorMessage(error, 'Query failed') });
  }
}

function* getMongoSchema(action) {
  try {
    const res = yield call(Api.getMongoSchema, { db: action.payload.db, collection: action.payload.collection });
    if (res?.success) {
      yield put({ type: actionTypes.GET_MONGO_SCHEMA_SUCCESS, data: res.result });
    } else {
      yield put({ type: actionTypes.GET_MONGO_SCHEMA_FAILURE, error: toErrorMessage(res, 'Failed to fetch schema') });
    }
  } catch (error) {
    yield put({ type: actionTypes.GET_MONGO_SCHEMA_FAILURE, error: toErrorMessage(error, 'Failed to fetch schema') });
  }
}

function* watchGetOrgDBs() {
  yield takeLatest(actionTypes.GET_ORG_DBS_REQUEST, getOrgDBs);
}

function* watchGetDBCollections() {
  yield takeLatest(actionTypes.GET_DB_COLLECTIONS_REQUEST, getDBCollections);
}

function* watchExecuteMongoQuery() {
  yield takeLatest(actionTypes.EXECUTE_MONGO_QUERY_REQUEST, executeMongoQuery);
}

function* watchGetMongoSchema() {
  yield takeLatest(actionTypes.GET_MONGO_SCHEMA_REQUEST, getMongoSchema);
}

export default [watchGetOrgDBs, watchGetDBCollections, watchExecuteMongoQuery, watchGetMongoSchema];
