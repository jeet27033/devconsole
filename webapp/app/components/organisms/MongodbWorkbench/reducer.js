import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import { REQUEST, SUCCESS, FAILURE } from '../../pages/App/constants';

const initialState = fromJS({
  databases: [],
  fetchingDBs: null,
  dbsError: null,
  collections: [],
  fetchingCollections: null,
  collectionsError: null,
  queryResult: null,
  queryExecutionTime: null,
  executingQuery: null,
  queryError: null,
  schema: [],
  fetchingSchema: null,
  schemaError: null,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ORG_DBS_REQUEST:
      return state.set('fetchingDBs', REQUEST).set('dbsError', null);
    case actionTypes.GET_ORG_DBS_SUCCESS:
      return state.set('fetchingDBs', SUCCESS).set('databases', fromJS(action.data || []));
    case actionTypes.GET_ORG_DBS_FAILURE:
      return state.set('fetchingDBs', FAILURE).set('dbsError', action.error);

    case actionTypes.GET_DB_COLLECTIONS_REQUEST:
      return state.set('fetchingCollections', REQUEST).set('collectionsError', null).set('collections', fromJS([]));
    case actionTypes.GET_DB_COLLECTIONS_SUCCESS:
      return state.set('fetchingCollections', SUCCESS).set('collections', fromJS(action.data || []));
    case actionTypes.GET_DB_COLLECTIONS_FAILURE:
      return state.set('fetchingCollections', FAILURE).set('collectionsError', action.error);

    case actionTypes.EXECUTE_MONGO_QUERY_REQUEST:
      return state.set('executingQuery', REQUEST).set('queryError', null);
    case actionTypes.EXECUTE_MONGO_QUERY_SUCCESS:
      return state
        .set('executingQuery', SUCCESS)
        .set('queryResult', action.data?.output)
        .set('queryExecutionTime', action.data?.executionTime);
    case actionTypes.EXECUTE_MONGO_QUERY_FAILURE:
      return state.set('executingQuery', FAILURE).set('queryError', action.error);
    case actionTypes.RESET_MONGO_QUERY:
      return state.set('queryResult', null).set('queryExecutionTime', null).set('queryError', null).set('executingQuery', null);

    case actionTypes.GET_MONGO_SCHEMA_REQUEST:
      return state.set('fetchingSchema', REQUEST).set('schemaError', null).set('schema', fromJS([]));
    case actionTypes.GET_MONGO_SCHEMA_SUCCESS:
      return state.set('fetchingSchema', SUCCESS).set('schema', fromJS(action.data || []));
    case actionTypes.GET_MONGO_SCHEMA_FAILURE:
      return state.set('fetchingSchema', FAILURE).set('schemaError', action.error);
    case actionTypes.CLEAR_MONGO_SCHEMA:
      return state.set('schema', fromJS([])).set('fetchingSchema', null).set('schemaError', null);

    default:
      return state;
  }
};

export default reducer;
