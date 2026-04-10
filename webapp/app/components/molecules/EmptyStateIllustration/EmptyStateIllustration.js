/**
 *
 * EmptyStateIllustration
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';

import CapRow from '@capillarytech/cap-ui-library/CapRow';
import CapIllustration from '@capillarytech/cap-ui-library/CapIllustration';
// import addEventIllustration from '@capillarytech/cap-ui-library/assets/images/addEventIllustration.svg';

import messages from './messages';
import styles from './style';

const EmptyStateIllustration = ({ className, intl: { formatMessage } }) => {
  const getIllustrationProps = hasAccess => ({
    illustrationImage,
    title: formatMessage(messages.nothingConfigured),
    description: formatMessage(messages.nothingConfiguredDesc),
    hasAccess,
    buttonClassName: 'empty-state-button',
  });

  return (
    <CapRow className={className}>
      <CapIllustration {...getIllustrationProps(true)} />
    </CapRow>
  );
};

EmptyStateIllustration.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string,
};

export default injectIntl(withStyles(EmptyStateIllustration, styles));
