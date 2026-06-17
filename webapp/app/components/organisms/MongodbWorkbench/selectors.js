import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const initialState = fromJS({
  databases: [],
  fetchingDBs: null,
  collections: [],
  fetchingCollections: null,
  queryResult: null,
  queryExecutionTime: null,
  executingQuery: null,
  queryError: null,
});

const selectDomain = (state) => state.get(REDUCER_KEY, initialState);

export const makeSelectDatabases = () =>
  createSelector(selectDomain, (s) => s.get('databases')?.toJS() || []);

export const makeSelectFetchingDBs = () =>
  createSelector(selectDomain, (s) => s.get('fetchingDBs'));

export const makeSelectCollections = () =>
  createSelector(selectDomain, (s) => s.get('collections')?.toJS() || []);

export const makeSelectFetchingCollections = () =>
  createSelector(selectDomain, (s) => s.get('fetchingCollections'));

export const makeSelectQueryResult = () =>
  createSelector(selectDomain, (s) => s.get('queryResult'));

export const makeSelectQueryExecutionTime = () =>
  createSelector(selectDomain, (s) => s.get('queryExecutionTime'));

export const makeSelectExecutingQuery = () =>
  createSelector(selectDomain, (s) => s.get('executingQuery'));

export const makeSelectQueryError = () =>
  createSelector(selectDomain, (s) => s.get('queryError'));

export const makeSelectSchema = () =>
  createSelector(selectDomain, (s) => s.get('schema')?.toJS() || []);

export const makeSelectFetchingSchema = () =>
  createSelector(selectDomain, (s) => s.get('fetchingSchema'));

export const makeSelectSchemaError = () =>
  createSelector(selectDomain, (s) => s.get('schemaError'));
