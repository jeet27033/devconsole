import React, { useState, useCallback } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapRow,
  CapColumn,
  CapInput,
  CapSelect,
  CapButton,
  CapHeading,
} from '@capillarytech/cap-ui-library';
import CapTooltipWithInfo from '@capillarytech/cap-ui-library/CapTooltipWithInfo';
import CapStepsAccordian from '@capillarytech/cap-ui-library/CapStepsAccordian';

import styles from './styles';
import messages from './messages';
import {
  VULCAN_APPS,
  COMMUNICATION_CHANNELS,
  SEVERITY_OPTIONS,
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  PERIOD_UNITS,
  DEFAULT_CONFIG,
} from './constants';

const { TextArea } = CapInput;

const FilterSection = ({
  config,
  configKey,
  radioName,
  onChange,
  showFrequency,
  formatMessage,
}) => {
  const handleSeverityChange = (severity) => {
    onChange(configKey, {
      ...config,
      severities: {
        ...config.severities,
        [severity]: !config.severities[severity],
      },
    });
  };

  const handleTypeChange = (value) => {
    onChange(configKey, { ...config, type: value });
  };

  const handleStatusChange = (status) => {
    onChange(configKey, {
      ...config,
      errorStatus: {
        ...config.errorStatus,
        [status]: !config.errorStatus[status],
      },
    });
  };

  return (
    <div className="stipper-content">
      <div className="filter-group-title">
        {formatMessage(showFrequency ? messages.severities : messages.severity)}
      </div>
      <div className="checkbox-row">
        {SEVERITY_OPTIONS.map((sev) => (
          <label key={sev} className="checkbox-item">
            <input
              type="checkbox"
              checked={config.severities[sev] || false}
              onChange={() => handleSeverityChange(sev)}
            />
            {sev.charAt(0).toUpperCase() + sev.slice(1)}
          </label>
        ))}
      </div>

      <div className="filter-group-title">
        {formatMessage(showFrequency ? messages.unhandledStates : messages.type)}
      </div>
      <div className="radio-row">
        {TYPE_OPTIONS.map((opt) => (
          <label key={opt.value} className="radio-item">
            <input
              type="radio"
              name={radioName}
              value={opt.value}
              checked={config.type === opt.value}
              onChange={() => handleTypeChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="filter-group-title">
        {formatMessage(messages.errorStatus)}
      </div>
      <div className="checkbox-row">
        {STATUS_OPTIONS.map((status) => (
          <label key={status} className="checkbox-item">
            <input
              type="checkbox"
              checked={config.errorStatus[status] || false}
              onChange={() => handleStatusChange(status)}
            />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </label>
        ))}
      </div>

      {showFrequency && (
        <div className="frequency-fields">
          <div className="frequency-row">
            <span className="frequency-label">
              {formatMessage(messages.threshold)}:
            </span>
            <CapInput
              className="frequency-input"
              type="number"
              value={config.threshold}
              onChange={(e) =>
                onChange(configKey, {
                  ...config,
                  threshold: e.target.value,
                })
              }
            />
          </div>
          <div className="frequency-row">
            <span className="frequency-label">
              {formatMessage(messages.period)}:
            </span>
            <CapInput
              className="frequency-input"
              type="number"
              value={config.periodValue}
              onChange={(e) =>
                onChange(configKey, {
                  ...config,
                  periodValue: e.target.value,
                })
              }
            />
            <CapSelect
              className="period-unit-select"
              options={PERIOD_UNITS}
              value={config.periodUnit}
              onChange={(value) =>
                onChange(configKey, { ...config, periodUnit: value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

const BugsnagConfig = ({ className, intl: { formatMessage } }) => {
  const [selectedApp, setSelectedApp] = useState('all');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activeAccordionKey, setActiveAccordionKey] = useState(null);

  const handleAppChange = useCallback((value) => {
    setSelectedApp(value);
  }, []);

  const handleAccordionChange = useCallback((key) => {
    setActiveAccordionKey(key);
  }, []);

  const handleConfigChange = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNotificationChange = useCallback((field, value) => {
    setConfig((prev) => ({
      ...prev,
      notification: { ...prev.notification, [field]: value },
    }));
  }, []);

  const handleSave = useCallback(() => {
    // Save config
  }, [config]);

  const isFormValid =
    config.notification.channel &&
    config.notification.webhook &&
    config.notification.description;

  const accordionItems = [
    {
      key: 'projectSpiking',
      header: (
        <span className="accordion-header-row">
          {formatMessage(messages.spikeInErrors)}
          <CapTooltipWithInfo title={formatMessage(messages.spikeTooltip)} />
        </span>
      ),
      content: (
        <FilterSection
          config={config.projectSpiking}
          configKey="projectSpiking"
          radioName="unhandled_state_spike"
          onChange={handleConfigChange}
          formatMessage={formatMessage}
        />
      ),
    },
    {
      key: 'firstException',
      header: (
        <span className="accordion-header-row">
          {formatMessage(messages.newErrors)}
          <CapTooltipWithInfo title={formatMessage(messages.newErrorsTooltip)} />
        </span>
      ),
      content: (
        <FilterSection
          config={config.firstException}
          configKey="firstException"
          radioName="unhandled_state_first"
          onChange={handleConfigChange}
          showFrequency={false}
          formatMessage={formatMessage}
        />
      ),
    },
    {
      key: 'exceptionConfig',
      header: (
        <span className="accordion-header-row">
          {formatMessage(messages.everyErrorOccurs)}
          <CapTooltipWithInfo title={formatMessage(messages.everyErrorTooltip)} />
        </span>
      ),
      content: (
        <FilterSection
          config={config.exceptionConfig}
          configKey="exceptionConfig"
          radioName="unhandled_state_exception"
          onChange={handleConfigChange}
          showFrequency={false}
          formatMessage={formatMessage}
        />
      ),
    },
    {
      key: 'exceptionFrequency',
      header: (
        <span className="accordion-header-row">
          {formatMessage(messages.frequentErrors)}
          <CapTooltipWithInfo title={formatMessage(messages.frequentErrorsTooltip)} />
        </span>
      ),
      content: (
        <FilterSection
          config={config.exceptionFrequency}
          configKey="exceptionFrequency"
          radioName="unhandled_state_frequency"
          onChange={handleConfigChange}
          showFrequency
          formatMessage={formatMessage}
        />
      ),
    },
    {
      key: 'errorStateChange',
      header: (
        <span className="accordion-header-row">
          {formatMessage(messages.collaboratorChanges)}
          <CapTooltipWithInfo title={formatMessage(messages.collaboratorTooltip)} />
        </span>
      ),
      content: (
        <FilterSection
          config={config.errorStateChange}
          configKey="errorStateChange"
          radioName="unhandled_state_change"
          onChange={handleConfigChange}
          showFrequency={false}
          formatMessage={formatMessage}
        />
      ),
    },
    {
      key: 'newRelease',
      header: (
        <span className="accordion-header-row">
          {formatMessage(messages.newReleases)}
          <CapTooltipWithInfo title={formatMessage(messages.newReleasesTooltip)} />
        </span>
      ),
      content: (
        <CapSelect
          mode="multiple"
          options={VULCAN_APPS.filter((a) => a.value !== 'all')}
          value={config.newRelease?.apps || []}
          onChange={(value) =>
            handleConfigChange('newRelease', { apps: value })
          }
          style={{ width: '100%' }}
          placeholder="Select Applications"
        />
      ),
    },
  ];

  return (
    <CapRow className={`${className} bugsnag-config`}>
      <CapColumn span={24}>
        <div className="toolbar-row">
          <CapSelect
            className="app-select"
            options={VULCAN_APPS}
            value={selectedApp}
            onChange={handleAppChange}
            style={{ width: '14rem' }}
          />
        </div>

        <div className="config-card">
          {/* Stability targets */}
          <CapHeading type="h3" className="section-title">
            {formatMessage(messages.stabilityTargets)}
          </CapHeading>

          <div className="stability-section">
          <div className="stability-row">
            <span className="stability-label">
              {formatMessage(messages.targetStability)}
            </span>
            <CapInput
              className="stability-input"
              type="number"
              min={0}
              max={100}
              step={0.001}
              value={config.targetStability}
              suffix="%"
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  targetStability: e.target.value,
                }))
              }
            />
            <CapTooltipWithInfo title={formatMessage(messages.targetStabilityTooltip)} />
          </div>

          <div className="stability-row">
            <span className="stability-label">
              {formatMessage(messages.criticalStability)}
            </span>
            <CapInput
              className="stability-input"
              type="number"
              min={0}
              max={100}
              step={0.001}
              value={config.criticalStability}
              suffix="%"
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  criticalStability: e.target.value,
                }))
              }
            />
            <CapTooltipWithInfo title={formatMessage(messages.criticalStabilityTooltip)} />
          </div>
          </div>

          <hr className="section-divider" />

          {/* Team notifications */}
          <CapHeading type="h3" className="section-title">
            {formatMessage(messages.teamNotifications)}
          </CapHeading>

          <div className="notification-form">
            <div className="form-row">
              <span className="form-label">
                {formatMessage(messages.communicationChannel)}
              </span>
              <div className="form-input">
                <CapSelect
                  className="channel-select"
                  options={COMMUNICATION_CHANNELS}
                  value={config.notification.type}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <span className="form-label">
                {formatMessage(messages.channel)}
              </span>
              <div className="form-input">
                <CapInput
                  placeholder={formatMessage(messages.channelPlaceholder)}
                  value={config.notification.channel}
                  onChange={(e) =>
                    handleNotificationChange('channel', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <span className="form-label">
                {formatMessage(messages.webhook)}
              </span>
              <div className="form-input">
                <CapInput
                  placeholder={formatMessage(messages.webhookPlaceholder)}
                  value={config.notification.webhook}
                  onChange={(e) =>
                    handleNotificationChange('webhook', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <span className="form-label">
                {formatMessage(messages.description)}
              </span>
              <div className="form-input">
                <TextArea
                  rows={4}
                  placeholder={formatMessage(messages.descriptionPlaceholder)}
                  value={config.notification.description}
                  onChange={(e) =>
                    handleNotificationChange('description', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Config accordion */}
          <CapHeading type="h3" className="section-title">
            {formatMessage(messages.config)}
          </CapHeading>

          <div className="config-section">
            <CapStepsAccordian
              className="config-accordion"
              items={accordionItems}
              showNumberSteps={false}
              isChevronIcon
              activeKey={activeAccordionKey}
              onChange={handleAccordionChange}
            />

            <CapButton
              className="save-button"
              type="primary"
              onClick={handleSave}
              disabled={!isFormValid}
            >
              {formatMessage(messages.save)}
            </CapButton>
          </div>
        </div>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(BugsnagConfig, styles));
