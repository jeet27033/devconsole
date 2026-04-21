import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { REDUCER_KEY } from './constants';

const selectExtensionsDeploymentDomain = (state = fromJS({})) =>
  state.get(REDUCER_KEY) || fromJS({});

const makeSelectBuildHistory = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    (substate.get('buildHistory') || fromJS([])).toJS(),
  );

const makeSelectFetchingBuildHistory = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    substate.get('fetchingBuildHistory'),
  );

export { makeSelectBuildHistory, makeSelectFetchingBuildHistory };
