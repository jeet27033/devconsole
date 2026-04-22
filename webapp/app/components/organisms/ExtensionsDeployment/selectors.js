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

const makeSelectBuildLogs = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    substate.get('buildLogs') || '',
  );

const makeSelectFetchingBuildLogs = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    substate.get('fetchingBuildLogs'),
  );

const makeSelectBuildMeta = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    (substate.get('buildMeta') || fromJS([])).toJS(),
  );

const makeSelectFetchingBuildMeta = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    substate.get('fetchingBuildMeta'),
  );

const makeSelectTriggerBuildResult = () =>
  createSelector(selectExtensionsDeploymentDomain, substate => {
    const result = substate.get('triggerBuildResult');
    return result && result.toJS ? result.toJS() : result;
  });

const makeSelectTriggeringBuild = () =>
  createSelector(selectExtensionsDeploymentDomain, substate =>
    substate.get('triggeringBuild'),
  );

export {
  makeSelectBuildHistory,
  makeSelectFetchingBuildHistory,
  makeSelectBuildLogs,
  makeSelectFetchingBuildLogs,
  makeSelectBuildMeta,
  makeSelectFetchingBuildMeta,
  makeSelectTriggerBuildResult,
  makeSelectTriggeringBuild,
};
