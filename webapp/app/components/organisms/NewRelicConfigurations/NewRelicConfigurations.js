import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import CapModal from '@capillarytech/cap-ui-library/CapModal';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';

import styles from './styles';
import messages from './messages';
import {
  STATUS_OPTIONS,
  DEFAULT_STATUS,
  CONDITION_TABLE_COLUMNS,
  CONDITION_OPERATORS,
  PRIORITY_LEVELS,
  DURATION_TYPES,
  TIME_UNITS,
  DEFAULT_THRESHOLD,
} from './constants';

const { TextArea } = CapInput;

const NewRelicConfigurations = ({ className, intl: { formatMessage } }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [platformFilter, setPlatformFilter] = useState('');
  const [signalFilter, setSignalFilter] = useState('');
  const [platforms, setPlatforms] = useState([
    { value: '', label: 'All' },
    { value: 'Loyalty Engine', label: 'Loyalty Engine' },
    { value: 'Campaign Manager', label: 'Campaign Manager' },
    { value: 'Engage+', label: 'Engage+' },
    { value: 'Insights+', label: 'Insights+' },
  ]);
  const [signals, setSignals] = useState([
    { value: '', label: 'All' },
    { value: 'Error Rate', label: 'Error Rate' },
    { value: 'Latency', label: 'Latency' },
    { value: 'Throughput', label: 'Throughput' },
    { value: 'Apdex', label: 'Apdex' },
  ]);
  const [conditions, setConditions] = useState([
    { id: 'cond-001', conditionName: 'High Error Rate - Points API', status: 'Active', platform: 'Loyalty Engine', appName: 'loyalty-engine-sg', metric: 'Error percentage', signal: 'Error Rate', filteredApis: '/api/v2/loyalty/points/*', thresholds: [{ priority: 'Critical', operator: 'Above', value: '5%' }, { priority: 'Warning', operator: 'Above', value: '2%' }], lastModified: '2026-04-12', modifiedBy: 'jeet.patel' },
    { id: 'cond-002', conditionName: 'Latency P95 Threshold - Member Lookup', status: 'Active', platform: 'Loyalty Engine', appName: 'loyalty-engine-sg', metric: 'Response time (P95)', signal: 'Latency', filteredApis: '/api/v2/members/lookup', thresholds: [{ priority: 'Critical', operator: 'Above', value: '500ms' }], lastModified: '2026-04-11', modifiedBy: 'dev.ops' },
    { id: 'cond-003', conditionName: 'Transaction Processing Timeout', status: 'Active', platform: 'Campaign Manager', appName: 'campaign-manager-sg', metric: 'Response time (P99)', signal: 'Latency', filteredApis: '/api/v2/transactions/*', thresholds: [{ priority: 'Critical', operator: 'Above', value: '3000ms' }, { priority: 'Warning', operator: 'Above', value: '1500ms' }], lastModified: '2026-04-10', modifiedBy: 'admin.user' },
    { id: 'cond-004', conditionName: 'Coupon Validation 4xx Rate', status: 'Active', platform: 'Engage+', appName: 'engage-plus-sg', metric: 'HTTP 4xx error rate', signal: 'Error Rate', filteredApis: '/api/v2/coupons/validate', thresholds: [{ priority: 'Warning', operator: 'Above', value: '10%' }], lastModified: '2026-04-09', modifiedBy: 'jeet.patel' },
    { id: 'cond-005', conditionName: 'Low Throughput Alert', status: 'Disabled', platform: 'Loyalty Engine', appName: 'loyalty-engine-sg', metric: 'Throughput (rpm)', signal: 'Throughput', filteredApis: null, thresholds: [{ priority: 'Warning', operator: 'Below', value: '100 rpm' }], lastModified: '2026-04-08', modifiedBy: 'dev.ops' },
    { id: 'cond-006', conditionName: 'Apdex Score Drop - Insights', status: 'Active', platform: 'Insights+', appName: 'insights-plus-sg', metric: 'Apdex score', signal: 'Apdex', filteredApis: null, thresholds: [{ priority: 'Critical', operator: 'Below', value: '0.7' }, { priority: 'Warning', operator: 'Below', value: '0.85' }], lastModified: '2026-04-07', modifiedBy: 'admin.user' },
    { id: 'cond-007', conditionName: 'Gateway 5xx Spike', status: 'Active', platform: 'Campaign Manager', appName: 'campaign-manager-sg', metric: 'HTTP 5xx error count', signal: 'Error Rate', filteredApis: null, thresholds: [{ priority: 'Critical', operator: 'Above', value: '50' }], lastModified: '2026-04-06', modifiedBy: 'jeet.patel' },
    { id: 'cond-008', conditionName: 'Notification Delivery Latency', status: 'Disabled', platform: 'Engage+', appName: 'engage-plus-sg', metric: 'Response time (P95)', signal: 'Latency', filteredApis: '/api/v2/notifications/*', thresholds: [{ priority: 'Warning', operator: 'Above', value: '2000ms' }], lastModified: '2026-04-05', modifiedBy: 'dev.ops' },
  ]);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const menuRef = useRef(null);

  // Form state
  const [conditionName, setConditionName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [filterScopeEnabled, setFilterScopeEnabled] = useState(false);
  const [filterApis, setFilterApis] = useState([]);
  const [thresholds, setThresholds] = useState([{ ...DEFAULT_THRESHOLD }]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDesc, setNotificationDesc] = useState('');

  // Close action menu on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const filteredConditions = useMemo(() => {
    let result = conditions;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.conditionName?.toLowerCase().includes(q),
      );
    }
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (platformFilter) {
      result = result.filter((c) => c.platform === platformFilter);
    }
    if (signalFilter) {
      result = result.filter((c) => c.signal === signalFilter);
    }
    return result;
  }, [conditions, searchQuery, statusFilter, platformFilter, signalFilter]);

  const resetForm = useCallback(() => {
    setConditionName('');
    setSelectedPlatform('');
    setSelectedMetric('');
    setFilterScopeEnabled(false);
    setFilterApis([]);
    setThresholds([{ ...DEFAULT_THRESHOLD }]);
    setShowNotification(false);
    setNotificationTitle('');
    setNotificationDesc('');
    setEditingCondition(null);
  }, []);

  const handleOpenNewCondition = useCallback(() => {
    resetForm();
    setSidePanelOpen(true);
  }, [resetForm]);

  const handleEditCondition = useCallback((condition) => {
    setEditingCondition(condition);
    setConditionName(condition.conditionName || '');
    setSelectedPlatform(condition.platform || '');
    setSelectedMetric(condition.metric || '');
    setThresholds(
      condition.thresholds?.length
        ? condition.thresholds
        : [{ ...DEFAULT_THRESHOLD }],
    );
    setSidePanelOpen(true);
    setOpenMenuId(null);
  }, []);

  const handleDeleteCondition = useCallback((conditionId) => {
    // API call placeholder: DELETE alert-management/backend/account/{accountId}/conditions/{conditionId}/delete
    setOpenMenuId(null);
  }, []);

  const handleToggleConditionStatus = useCallback((condition) => {
    // API call placeholder: POST alert-management/backend/account/{accountId}/conditions/{conditionId}/action
    setOpenMenuId(null);
  }, []);

  const handleAddThreshold = useCallback(() => {
    setThresholds((prev) => [...prev, { ...DEFAULT_THRESHOLD }]);
  }, []);

  const handleRemoveThreshold = useCallback((index) => {
    setThresholds((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleThresholdChange = useCallback((index, field, value) => {
    setThresholds((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }, []);

  const handleSubmit = useCallback(() => {
    // API call placeholder: POST/PUT alert condition
    setSidePanelOpen(false);
    resetForm();
  }, [conditionName, selectedPlatform, selectedMetric, thresholds, resetForm]);

  const handleSaveSettings = useCallback(() => {
    // API call placeholder: POST alert-management/backend/settings/update
    setSettingsVisible(false);
  }, [webhookUrl]);

  return (
    <CapRow className={`${className} newrelic-configurations`}>
      <CapColumn span={24}>
        <div className="filters-section">
          <CapInput
            className="search-input"
            value={searchQuery}
            placeholder={formatMessage(messages.searchPlaceholder)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CapSelect
            className="platform-select"
            options={platforms}
            value={platformFilter}
            onChange={setPlatformFilter}
          />
          <CapSelect
            className="filter-select"
            options={signals}
            value={signalFilter}
            onChange={setSignalFilter}
          />
          <CapSelect
            className="filter-select"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="filters-right">
            <button
              className="settings-btn"
              onClick={() => setSettingsVisible(true)}
            >
              <CapIcon type="setting" />
            </button>
            <CapButton type="primary" onClick={handleOpenNewCondition}>
              {formatMessage(messages.newAlertCondition)}
            </CapButton>
          </div>
        </div>

        {loading && <CapSpin />}

        {!loading && (
          <div className="conditions-table-container">
            <table className="conditions-table">
              <thead>
                <tr>
                  {CONDITION_TABLE_COLUMNS.map((col) => (
                    <th
                      key={col.dataIndex}
                      style={{
                        width: col.width,
                        textAlign: col.align || 'left',
                      }}
                    >
                      <div>{col.title}</div>
                      {col.subTitle && (
                        <div className="sub-header">{col.subTitle}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredConditions.length === 0 ? (
                  <tr>
                    <td colSpan={CONDITION_TABLE_COLUMNS.length}>
                      <div className="empty-state">
                        {formatMessage(messages.noConditions)}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredConditions.map((cond) => (
                    <tr key={cond.id}>
                      <td>
                        <div className="condition-name-cell">
                          <span>{cond.conditionName}</span>
                          <div className="condition-status">
                            <span
                              className={`status-dot ${cond.status === 'Active' ? 'active' : 'disabled'}`}
                            />
                            {cond.status}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{cond.platform}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {cond.appName}
                        </div>
                      </td>
                      <td>
                        <div>{cond.metric}</div>
                        {cond.filteredApis && (
                          <div
                            style={{ fontSize: '0.75rem', color: '#6B7280' }}
                          >
                            {cond.filteredApis}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="threshold-cell">
                          {(cond.thresholds || []).map((t, i) => (
                            <span
                              key={i}
                              className={`threshold-badge ${t.priority?.toLowerCase()}`}
                            >
                              {t.priority}: {t.operator} {t.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div>{cond.lastModified}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {cond.modifiedBy}
                        </div>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          position: 'relative',
                        }}
                      >
                        <button
                          className="action-btn"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === cond.id ? null : cond.id,
                            )
                          }
                        >
                          <CapIcon type="more" />
                        </button>
                        {openMenuId === cond.id && (
                          <div className="action-menu" ref={menuRef}>
                            <button
                              className="action-menu-item"
                              onClick={() => handleEditCondition(cond)}
                            >
                              <CapIcon type="edit" />
                              {formatMessage(messages.editCondition)}
                            </button>
                            <button
                              className="action-menu-item"
                              onClick={() =>
                                handleToggleConditionStatus(cond)
                              }
                            >
                              <CapIcon type="poweroff" />
                              {cond.status === 'Active'
                                ? formatMessage(messages.disableCondition)
                                : formatMessage(messages.enableCondition)}
                            </button>
                            <button
                              className="action-menu-item danger"
                              onClick={() =>
                                handleDeleteCondition(cond.id)
                              }
                            >
                              <CapIcon type="delete" />
                              {formatMessage(messages.deleteCondition)}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Side Panel for Create/Edit */}
        {sidePanelOpen && (
          <>
            <div
              className="side-panel-backdrop"
              onClick={() => {
                setSidePanelOpen(false);
                resetForm();
              }}
            />
            <div className="side-panel">
              <div className="side-panel-header">
                <h3>
                  {editingCondition
                    ? formatMessage(messages.editCondition)
                    : formatMessage(messages.newAlertCondition)}
                </h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    setSidePanelOpen(false);
                    resetForm();
                  }}
                >
                  <CapIcon type="close" />
                </button>
              </div>

              <div className="side-panel-body">
                {/* Step 1: Alert condition name */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">1</div>
                    <span className="step-title">
                      {formatMessage(messages.conditionName)}
                    </span>
                  </div>
                  <div className="step-content">
                    <CapInput
                      value={conditionName}
                      placeholder={formatMessage(
                        messages.conditionNamePlaceholder,
                      )}
                      onChange={(e) => setConditionName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Step 2: Define Alert Conditions */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">2</div>
                    <span className="step-title">
                      {formatMessage(messages.defineConditions)}
                    </span>
                  </div>
                  <div className="step-content">
                    <div className="form-field">
                      <label>
                        {formatMessage(messages.selectPlatform)}
                      </label>
                      <CapSelect
                        options={platforms}
                        value={selectedPlatform}
                        onChange={(val) => {
                          setSelectedPlatform(val);
                          setSelectedMetric('');
                          // API call placeholder: fetch metrics for platform
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-field">
                      <label>{formatMessage(messages.selectMetric)}</label>
                      <CapSelect
                        options={metrics}
                        value={selectedMetric}
                        onChange={setSelectedMetric}
                        disabled={!selectedPlatform}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="form-field">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={filterScopeEnabled}
                          onChange={(e) =>
                            setFilterScopeEnabled(e.target.checked)
                          }
                        />
                        <label style={{ marginBottom: 0 }}>
                          {formatMessage(messages.filterScope)}
                        </label>
                      </div>
                      {filterScopeEnabled && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <CapSelect
                            mode="multiple"
                            options={[]}
                            value={filterApis}
                            onChange={setFilterApis}
                            placeholder={formatMessage(
                              messages.filterByApis,
                            )}
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 3: Set thresholds */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">3</div>
                    <span className="step-title">
                      {formatMessage(messages.setThresholds)}
                    </span>
                  </div>
                  <div className="step-content">
                    {thresholds.map((threshold, index) => (
                      <div key={index} className="threshold-card">
                        <div className="threshold-row">
                          <CapSelect
                            options={PRIORITY_LEVELS}
                            value={threshold.priority}
                            onChange={(val) =>
                              handleThresholdChange(index, 'priority', val)
                            }
                            style={{ width: '8rem' }}
                          />
                          <CapSelect
                            options={CONDITION_OPERATORS}
                            value={threshold.operator}
                            onChange={(val) =>
                              handleThresholdChange(index, 'operator', val)
                            }
                            style={{ width: '10rem' }}
                          />
                          <CapInput
                            type="number"
                            value={threshold.value}
                            placeholder="Value"
                            onChange={(e) =>
                              handleThresholdChange(
                                index,
                                'value',
                                e.target.value,
                              )
                            }
                            style={{ width: '6rem' }}
                          />
                          <CapSelect
                            options={DURATION_TYPES}
                            value={threshold.durationType}
                            onChange={(val) =>
                              handleThresholdChange(
                                index,
                                'durationType',
                                val,
                              )
                            }
                            style={{ width: '10rem' }}
                          />
                          <CapInput
                            type="number"
                            value={threshold.durationValue}
                            placeholder="Duration"
                            onChange={(e) =>
                              handleThresholdChange(
                                index,
                                'durationValue',
                                e.target.value,
                              )
                            }
                            style={{ width: '5rem' }}
                          />
                          <CapSelect
                            options={TIME_UNITS}
                            value={threshold.timeUnit}
                            onChange={(val) =>
                              handleThresholdChange(index, 'timeUnit', val)
                            }
                            style={{ width: '7rem' }}
                          />
                          {thresholds.length > 1 && (
                            <CapButton
                              type="flat"
                              onClick={() => handleRemoveThreshold(index)}
                            >
                              <CapIcon type="close" />
                            </CapButton>
                          )}
                        </div>
                      </div>
                    ))}
                    <CapButton type="flat" onClick={handleAddThreshold}>
                      + {formatMessage(messages.addThreshold)}
                    </CapButton>
                  </div>
                </div>

                {/* Step 4: Notification template (optional) */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">4</div>
                    <span className="step-title">
                      {formatMessage(messages.customizeNotification)}
                    </span>
                    <CapButton
                      type="flat"
                      onClick={() => setShowNotification((p) => !p)}
                    >
                      <CapIcon
                        type={showNotification ? 'chevron-up' : 'chevron-down'}
                      />
                    </CapButton>
                  </div>
                  {showNotification && (
                    <div className="step-content">
                      <div className="notification-section">
                        <div className="form-field">
                          <label>
                            {formatMessage(messages.notificationTitle)}
                          </label>
                          <CapInput
                            value={notificationTitle}
                            onChange={(e) =>
                              setNotificationTitle(e.target.value)
                            }
                          />
                        </div>
                        <div className="form-field">
                          <label>
                            {formatMessage(messages.notificationDescription)}
                          </label>
                          <TextArea
                            rows={3}
                            value={notificationDesc}
                            onChange={(e) =>
                              setNotificationDesc(e.target.value)
                            }
                          />
                        </div>
                        <CapButton
                          type="flat"
                          onClick={() => {
                            setNotificationTitle('');
                            setNotificationDesc('');
                          }}
                        >
                          {formatMessage(messages.resetTemplate)}
                        </CapButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="side-panel-footer">
                <CapButton
                  type="primary"
                  onClick={handleSubmit}
                  disabled={
                    conditionName.length < 10 ||
                    conditionName.length > 50 ||
                    !selectedPlatform ||
                    !selectedMetric
                  }
                >
                  {editingCondition
                    ? formatMessage(messages.update)
                    : formatMessage(messages.create)}
                </CapButton>
                <CapButton
                  onClick={() => {
                    setSidePanelOpen(false);
                    resetForm();
                  }}
                >
                  {formatMessage(messages.cancel)}
                </CapButton>
              </div>
            </div>
          </>
        )}

        {/* Settings Modal */}
        <CapModal
          title={formatMessage(messages.settings)}
          visible={settingsVisible}
          onOk={handleSaveSettings}
          onCancel={() => setSettingsVisible(false)}
          okText={formatMessage(messages.save)}
          cancelText={formatMessage(messages.cancel)}
        >
          <div className="form-field">
            <label>{formatMessage(messages.slackWebhookUrl)}</label>
            <CapInput
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        </CapModal>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(NewRelicConfigurations, styles));
