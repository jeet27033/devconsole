import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { fromJS } from 'immutable';
import * as appConstants from '../App/constants';

const { SUCCESS } = appConstants;
/**
 * Direct selector to the cap state domain
 */

const selectCapDomain = (state = fromJS({})) =>
  state.get(`${CURRENT_APP_NAME}_cap`);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Cap
 */

const makeSelectGlobal = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) => substate.toJS());

const makeSelectOrg = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) => ({
    fetchingUserdata: substate.get('fetchingUserdata'),
    orgID: substate.get('orgID'),
  }));

const makeSelectCap = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) => {
    const user = substate.get('user')?.toJS();
    return {
      user: !isEmpty(user) && user,
      currentOrgDetails: substate.get('currentOrgDetails')?.toJS(),
    };
  });

const makeSelectUser = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) =>
    substate.get('user')?.toJS(),
  );

const makeSelectSidebarMenuData = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) => {
    const sidebarMenuData = substate.get('sidebarMenuData')?.toJS();
    let parsedMenuData = [];
    if (sidebarMenuData?.status === SUCCESS && sidebarMenuData?.data) {
      parsedMenuData = sidebarMenuData.data;
    }
    return parsedMenuData;
  });

const makeSelectTopbarMenuData = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) => {
    const topbarMenuData = substate.get('topbarMenuData')?.toJS();
    let parsedMenuData = [];
    if (topbarMenuData?.status === SUCCESS && topbarMenuData?.data) {
      parsedMenuData = topbarMenuData.data;
    }
    return parsedMenuData;
  });

const makeSelectIsoLangToLocizeLangMapping = () =>
  createSelector(selectCapDomain, (substate = fromJS({})) => {
    const supportedLocales = substate.get('supportedLocales')?.toJS();
    const localeToLocizeMapping = new Map();

    if (supportedLocales.length) {
      supportedLocales.forEach(({ locale, locize_locale }) => {
        localeToLocizeMapping.set(locale, locize_locale);
      });
    }

    return localeToLocizeMapping;
  });

export {
  selectCapDomain,
  makeSelectOrg,
  makeSelectCap,
  makeSelectUser,
  makeSelectSidebarMenuData,
  makeSelectTopbarMenuData,
  makeSelectGlobal,
  makeSelectIsoLangToLocizeLangMapping,
};
