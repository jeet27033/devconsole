import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const selectConfigManagementDomain = (state = fromJS({})) =>
  state.get(REDUCER_KEY) || fromJS({});

const makeSelectConfigs = () =>
  createSelector(selectConfigManagementDomain, substate =>
    (substate.get('configs') || fromJS([])).toJS(),
  );

const makeSelectFetchingConfigs = () =>
  createSelector(selectConfigManagementDomain, substate =>
    substate.get('fetchingConfigs'),
  );

const makeSelectConfigsError = () =>
  createSelector(selectConfigManagementDomain, substate =>
    substate.get('configsError'),
  );

const makeSelectConfigRequests = () =>
  createSelector(selectConfigManagementDomain, substate =>
    (substate.get('configRequests') || fromJS([])).toJS(),
  );

const makeSelectFetchingConfigRequests = () =>
  createSelector(selectConfigManagementDomain, substate =>
    substate.get('fetchingConfigRequests'),
  );

const makeSelectSavingConfig = () =>
  createSelector(selectConfigManagementDomain, substate =>
    substate.get('savingConfig'),
  );

const makeSelectSaveConfigError = () =>
  createSelector(selectConfigManagementDomain, substate =>
    substate.get('saveConfigError'),
  );

export {
  makeSelectConfigs,
  makeSelectFetchingConfigs,
  makeSelectConfigsError,
  makeSelectConfigRequests,
  makeSelectFetchingConfigRequests,
  makeSelectSavingConfig,
  makeSelectSaveConfigError,
};
