/*
 * OrgChange Message
 *
 * This contains all the text for the OrgChange.
 */

import { defineMessages } from 'react-intl';

export const scope = 'devconsole.components.organisms.OrgChange';

export default defineMessages({
  orgRefreshText: {
    id: `${scope}.orgRefreshText`,
    defaultMessage: 'Org refresh',
  },
  refreshOrgText: {
    id: `${scope}.refreshOrgText`,
    defaultMessage:
      'Refreshing this page & changing the Org from <b>{oldOrgName}</b> to <b>{newOrgName}</b>. At a time only one Org can be selected on the browser.',
  },
  refreshText: {
    id: `${scope}.refreshText`,
    defaultMessage: 'Refreshing in {time}',
  },
  orgChangeText: {
    id: `${scope}.orgChangeText`,
    defaultMessage:
      'Changing from <b>{oldOrgName}</b> to <b>{newOrgName}</b> will change the organisation for applications open in other tabs as well.<br/>Do you want to make the change to <b>{newOrgName}</b>?',
  },
  orgChangedText: {
    id: `${scope}.orgChangedText`,
    defaultMessage: 'Organization changed to ',
  },
  newOrgName: {
    id: `${scope}.newOrgName`,
    defaultMessage: '{newOrgName}',
  },
});
