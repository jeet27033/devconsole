import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const selectLogViewerDomain = (state = fromJS({})) =>
  state.get(REDUCER_KEY) || fromJS({});

const makeSelectLogs = () =>
  createSelector(selectLogViewerDomain, substate =>
    (substate.get('logs') || fromJS([])).toJS(),
  );

const makeSelectTotalEntries = () =>
  createSelector(selectLogViewerDomain, substate =>
    substate.get('totalEntries') || 0,
  );

const makeSelectLastTimestamp = () =>
  createSelector(selectLogViewerDomain, substate =>
    substate.get('lastTimestamp'),
  );

const makeSelectFetchingLogs = () =>
  createSelector(selectLogViewerDomain, substate => substate.get('fetching'));

const makeSelectLogsError = () =>
  createSelector(selectLogViewerDomain, substate => substate.get('error'));

const makeSelectExtensionsMap = () =>
  createSelector(selectLogViewerDomain, substate =>
    (substate.get('extensionsMap') || fromJS({})).toJS(),
  );

const makeSelectFetchingExtensions = () =>
  createSelector(selectLogViewerDomain, substate =>
    substate.get('fetchingExtensions'),
  );

export {
  makeSelectLogs,
  makeSelectTotalEntries,
  makeSelectLastTimestamp,
  makeSelectFetchingLogs,
  makeSelectLogsError,
  makeSelectExtensionsMap,
  makeSelectFetchingExtensions,
};
