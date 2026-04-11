import React from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapHeading,
  CapRow,
  CapColumn,
  CapButton,
  CapIcon,
  CapLabel,
} from '@capillarytech/cap-ui-library';
import styles from './styles';
import messages from './messages';
import {
  NEO_DEBUGGER_DOCS_URL,
  CHROME_EXTENSION_URL,
  FEATURES,
} from './constants';

const FeatureCard = ({ icon, title, description }) => (
  <CapColumn span={8}>
    <div className="feature-card">
      <div className="feature-icon">
        <CapIcon type={icon} size="l" />
      </div>
      <CapHeading type="h3">{title}</CapHeading>
      <CapLabel type="label4">{description}</CapLabel>
    </div>
  </CapColumn>
);

const NeoDebugger = ({ className, intl: { formatMessage } }) => (
  <div className={`${className} extension-page`}>
    <div className="extension-header">
      <CapHeading type="h1">{formatMessage(messages.pageTitle)}</CapHeading>
      <CapLabel type="label3">{formatMessage(messages.pageSubtitle)}</CapLabel>
    </div>

    <div className="section-title">
      <CapHeading type="h2">
        <CapIcon type="star" size="s" className="section-title-icon" />
        {formatMessage(messages.keyFeatures)}
      </CapHeading>
    </div>

    <CapRow className="feature-section" type="flex" gutter={[24, 24]}>
      {FEATURES.map((feature) => (
        <FeatureCard
          key={feature.titleKey}
          icon={feature.icon}
          title={formatMessage(messages[feature.titleKey])}
          description={formatMessage(messages[feature.descKey])}
        />
      ))}
    </CapRow>

    <div className="installation-section">
      <CapButton
        type="primary"
        className="download-button"
        onClick={() => window.open(CHROME_EXTENSION_URL, '_blank')}
      >
        <CapIcon type="download" size="s" />
        {' '}{formatMessage(messages.installExtension)}
      </CapButton>
    </div>

    <div className="support-section">
      <CapHeading type="h2">
        <CapIcon type="headphone" size="s" className="section-title-icon" />
        {formatMessage(messages.needHelp)}
      </CapHeading>
      <CapLabel type="label4">
        {formatMessage(messages.contactSupport)}
      </CapLabel>
      <CapLabel type="label4">
        {formatMessage(messages.docsInfo)}{' '}
        <a href={NEO_DEBUGGER_DOCS_URL} target="_blank" rel="noopener noreferrer">
          {formatMessage(messages.docsLink)}
        </a>
        .
      </CapLabel>
    </div>
  </div>
);

export default injectIntl(withStyles(NeoDebugger, styles));
