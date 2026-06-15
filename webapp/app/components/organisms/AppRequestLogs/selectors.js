import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const selectDomain = (state = fromJS({})) =>
  state.get(REDUCER_KEY) || fromJS({});

export const makeSelectExtensionsMap = () =>
  createSelector(selectDomain, substate =>
    (substate.get('extensionsMap') || fromJS({})).toJS(),
  );

export const makeSelectFetchingExtensions = () =>
  createSelector(selectDomain, substate =>
    substate.get('fetchingExtensions'),
  );

export const makeSelectAppConfig = () =>
  createSelector(selectDomain, substate =>
    (substate.get('appConfig') || fromJS({})).toJS(),
  );

export const makeSelectFetchingAppFields = () =>
  createSelector(selectDomain, substate =>
    substate.get('fetchingAppFields'),
  );
