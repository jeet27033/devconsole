import { actionTypes } from './constants';

export const getOrgDBs = () => ({ type: actionTypes.GET_ORG_DBS_REQUEST });
export const getOrgDBsSuccess = (data) => ({ type: actionTypes.GET_ORG_DBS_SUCCESS, data });
export const getOrgDBsFailure = (error) => ({ type: actionTypes.GET_ORG_DBS_FAILURE, error });

export const getDBCollections = (db) => ({ type: actionTypes.GET_DB_COLLECTIONS_REQUEST, payload: { db } });
export const getDBCollectionsSuccess = (data) => ({ type: actionTypes.GET_DB_COLLECTIONS_SUCCESS, data });
export const getDBCollectionsFailure = (error) => ({ type: actionTypes.GET_DB_COLLECTIONS_FAILURE, error });

export const executeMongoQuery = (db, query) => ({ type: actionTypes.EXECUTE_MONGO_QUERY_REQUEST, payload: { db, query } });
export const executeMongoQuerySuccess = (data) => ({ type: actionTypes.EXECUTE_MONGO_QUERY_SUCCESS, data });
export const executeMongoQueryFailure = (error) => ({ type: actionTypes.EXECUTE_MONGO_QUERY_FAILURE, error });
export const resetMongoQuery = () => ({ type: actionTypes.RESET_MONGO_QUERY });

export const getMongoSchema = (db, collection) => ({ type: actionTypes.GET_MONGO_SCHEMA_REQUEST, payload: { db, collection } });
export const getMongoSchemaSuccess = (data) => ({ type: actionTypes.GET_MONGO_SCHEMA_SUCCESS, data });
export const getMongoSchemaFailure = (error) => ({ type: actionTypes.GET_MONGO_SCHEMA_FAILURE, error });
export const clearMongoSchema = () => ({ type: actionTypes.CLEAR_MONGO_SCHEMA });
