import React from 'react';
import { CapTooltip } from '@capillarytech/cap-ui-library';
import { injectIntl } from 'react-intl';
import messages from './messages';
import { Auth } from '@capillarytech/cap-ui-utils';
import isEmpty from 'lodash/isEmpty';

export const RbacTooltipWrapper = ({ customTooltipMsg = '', permission, children, intl: { formatMessage } }) => {
  const hasNoAccess = !Auth.hasAccess(permission);
  return (
    hasNoAccess || !isEmpty(customTooltipMsg) ? (
      <CapTooltip title={customTooltipMsg || formatMessage(messages.accessDenied)}>
        {children}
      </CapTooltip>
    ) : children
  );

};

export default injectIntl(RbacTooltipWrapper);