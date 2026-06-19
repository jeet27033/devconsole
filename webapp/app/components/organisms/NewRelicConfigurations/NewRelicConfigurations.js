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
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';

import CustomModal from '../../molecules/CustomModal';
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
import {
  getNewRelicPlatforms,
  getNewRelicFormMeta,
  getNewRelicSettings,
  updateNewRelicSettings,
  getNewRelicConditions,
  createNewRelicCondition,
  updateNewRelicCondition,
  newRelicConditionAction,
} from '../../../services/api';

const { TextArea } = CapInput;

const NewRelicConfigurations = ({ className, intl: { formatMessage } }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [platformFilter, setPlatformFilter] = useState('');
  const [signalFilter, setSignalFilter] = useState('');
  const [platforms, setPlatforms] = useState([{ value: '', label: 'All' }]);
  const [signals, setSignals] = useState([{ value: '', label: 'All' }]);
  const [metrics, setMetrics] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [conditionToDelete, setConditionToDelete] = useState(null);
  const menuRef = useRef(null);

  // Form state
  const [conditionName, setConditionName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [filterScopeEnabled, setFilterScopeEnabled] = useState(false);
  const [filterApis, setFilterApis] = useState([]);
  const [thresholds, setThresholds] = useState([{ ...DEFAULT_THRESHOLD }]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDesc, setNotificationDesc] = useState('');

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchInitialData = useCallback(async () => {
    try {
      const [platformsRes, metaRes, settingsRes] = await Promise.allSettled([
        getNewRelicPlatforms(),
        getNewRelicFormMeta(),
        getNewRelicSettings(),
      ]);

      if (platformsRes.status === 'fulfilled') {
        const data = platformsRes.value?.data?.data ?? platformsRes.value?.data ?? [];
        setPlatforms([{ value: '', label: 'All' }, ...data.map((p) => ({ value: p.id, label: p.label }))]);
      }

      if (metaRes.status === 'fulfilled') {
        const data = metaRes.value?.data?.data ?? metaRes.value?.data ?? {};
        const metricList = data.metrics ?? [];
        setMetrics(metricList.map((m) => ({ value: m.id, label: m.label })));
        setSignals([{ value: '', label: 'All' }, ...metricList.map((m) => ({ value: m.id, label: m.label }))]);
      }

      if (settingsRes.status === 'fulfilled') {
        const data = settingsRes.value?.data?.data ?? settingsRes.value?.data ?? {};
        setWebhookUrl(data.slack_webhook_url ?? '');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const fetchConditions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (platformFilter) params.set('platform', platformFilter);
      if (searchQuery) params.set('search', searchQuery);
      if (signalFilter) params.set('signal', signalFilter);
      const qs = params.toString();
      const res = await getNewRelicConditions(qs ? `?${qs}` : '');
      setConditions(res?.data?.data ?? res?.data ?? []);
    } catch (e) {
      setConditions([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, platformFilter, searchQuery, signalFilter]);

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchConditions(); }, [statusFilter, platformFilter, signalFilter]);

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  // ── Filtering (local search) ───────────────────────────────────────────────

  const filteredConditions = useMemo(() => {
    if (!searchQuery) return conditions;
    const q = searchQuery.toLowerCase();
    return conditions.filter((c) => c.conditionName?.toLowerCase().includes(q));
  }, [conditions, searchQuery]);

  // ── Form helpers ───────────────────────────────────────────────────────────

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
    setSelectedMetric(condition.metricId || '');
    setFilterApis(condition.filteredApis || []);
    setFilterScopeEnabled((condition.filteredApis || []).length > 0);
    setThresholds(condition.thresholds?.length ? condition.thresholds : [{ ...DEFAULT_THRESHOLD }]);
    setNotificationTitle(condition.notificationTitle || '');
    setNotificationDesc(condition.notificationDesc || '');
    setShowNotification(!!(condition.notificationTitle || condition.notificationDesc));
    setSidePanelOpen(true);
    setOpenMenuId(null);
  }, []);

  const handleToggleConditionStatus = useCallback(async (condition) => {
    setOpenMenuId(null);
    const action = condition.status === 'Active' ? 'disable' : 'enable';
    try {
      await newRelicConditionAction(condition.id, { action });
      setConditions((prev) =>
        prev.map((c) =>
          c.id === condition.id ? { ...c, status: action === 'enable' ? 'Active' : 'Disabled' } : c,
        ),
      );
    } catch (e) { /* ignore */ }
  }, []);

  const handleShowDeleteModal = useCallback((condition) => {
    setConditionToDelete(condition);
    setDeleteModalVisible(true);
    setOpenMenuId(null);
  }, []);

  const handleDeleteCondition = useCallback(async () => {
    if (!conditionToDelete) return;
    try {
      await newRelicConditionAction(conditionToDelete.id, { action: 'delete' });
      setConditions((prev) => prev.filter((c) => c.id !== conditionToDelete.id));
    } catch (e) { /* ignore */ } finally {
      setDeleteModalVisible(false);
      setConditionToDelete(null);
    }
  }, [conditionToDelete]);

  const handleAddThreshold = useCallback(() => {
    setThresholds((prev) => [...prev, { ...DEFAULT_THRESHOLD }]);
  }, []);

  const handleRemoveThreshold = useCallback((index) => {
    setThresholds((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleThresholdChange = useCallback((index, field, value) => {
    setThresholds((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const payload = {
      conditionName,
      platform: selectedPlatform,
      metricId: selectedMetric,
      filterApis: filterScopeEnabled ? filterApis : [],
      thresholds,
      notificationTitle: showNotification ? notificationTitle : null,
      notificationDesc: showNotification ? notificationDesc : null,
    };
    try {
      if (editingCondition) {
        await updateNewRelicCondition(editingCondition.id, payload);
      } else {
        await createNewRelicCondition(payload);
      }
      await fetchConditions();
      setSidePanelOpen(false);
      resetForm();
    } catch (e) { /* ignore */ } finally {
      setSubmitting(false);
    }
  }, [conditionName, selectedPlatform, selectedMetric, filterScopeEnabled, filterApis,
    thresholds, showNotification, notificationTitle, notificationDesc, editingCondition,
    fetchConditions, resetForm]);

  const handleSaveSettings = useCallback(async () => {
    try {
      await updateNewRelicSettings({ slack_webhook_url: webhookUrl });
    } catch (e) { /* ignore */ } finally {
      setSettingsVisible(false);
    }
  }, [webhookUrl]);

  const isFormValid = conditionName.length >= 10 && conditionName.length <= 50 && selectedPlatform && selectedMetric;

  const formatThresholds = (thrList) =>
    (thrList || []).map((t) => `${t.priority}: ${t.operator} ${t.value}`).join(', ');

  return (
    <CapRow className={`${className} newrelic-configurations`}>
      <CapColumn span={24}>
        <div className="filters-section">
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.search)}</span>
            <CapInput
              className="search-input"
              value={searchQuery}
              placeholder={formatMessage(messages.searchPlaceholder)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={fetchConditions}
            />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.platform)}</span>
            <CapSelect className="platform-select" options={platforms} value={platformFilter} onChange={setPlatformFilter} />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.signal)}</span>
            <CapSelect className="filter-select" options={signals} value={signalFilter} onChange={setSignalFilter} />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.status)}</span>
            <CapSelect className="filter-select" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          </div>
          <div className="filters-right">
            <button className="settings-btn" onClick={() => setSettingsVisible(true)}>
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
                    <th key={col.dataIndex} style={{ width: col.width, textAlign: col.align || 'left' }}>
                      <div>{col.title}</div>
                      {col.subTitle && <div className="sub-header">{col.subTitle}</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredConditions.length === 0 ? (
                  <tr>
                    <td colSpan={CONDITION_TABLE_COLUMNS.length}>
                      <div className="empty-state">{formatMessage(messages.noConditions)}</div>
                    </td>
                  </tr>
                ) : (
                  filteredConditions.map((cond) => (
                    <tr key={cond.id}>
                      <td>
                        <div className="condition-name-cell">
                          <span>{cond.conditionName}</span>
                          <div className="condition-status">
                            <span className={`status-dot ${cond.status === 'Active' ? 'active' : 'disabled'}`} />
                            {cond.status}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{cond.platform}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{cond.appName}</div>
                      </td>
                      <td>
                        <div>{cond.metric}</div>
                        {cond.filteredApis?.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{cond.filteredApis.join(', ')}</div>
                        )}
                      </td>
                      <td>
                        <div className="threshold-cell">
                          {(cond.thresholds || []).map((t, i) => (
                            <span key={i} className={`threshold-badge ${t.priority?.toLowerCase()}`}>
                              {t.priority}: {t.operator} {t.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div>{cond.lastModified ? new Date(cond.lastModified).toLocaleDateString() : '-'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{cond.modifiedBy}</div>
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        <button className="action-btn" onClick={() => setOpenMenuId(openMenuId === cond.id ? null : cond.id)}>
                          <CapIcon type="more" />
                        </button>
                        {openMenuId === cond.id && (
                          <div className="action-menu" ref={menuRef}>
                            <button className="action-menu-item" onClick={() => handleEditCondition(cond)}>
                              <CapIcon type="edit" />
                              {formatMessage(messages.editCondition)}
                            </button>
                            <button className="action-menu-item" onClick={() => handleToggleConditionStatus(cond)}>
                              <CapIcon type="poweroff" />
                              {cond.status === 'Active' ? formatMessage(messages.disableCondition) : formatMessage(messages.enableCondition)}
                            </button>
                            <button className="action-menu-item danger" onClick={() => handleShowDeleteModal(cond)}>
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
            <div className="side-panel-backdrop" onClick={() => { setSidePanelOpen(false); resetForm(); }} />
            <div className="side-panel">
              <div className="side-panel-header">
                <h3>{editingCondition ? formatMessage(messages.editCondition) : formatMessage(messages.newAlertCondition)}</h3>
                <button className="close-btn" onClick={() => { setSidePanelOpen(false); resetForm(); }}>
                  <CapIcon type="close" />
                </button>
              </div>

              <div className="side-panel-body">
                {/* Step 1: Alert condition name */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">1</div>
                    <span className="step-title">{formatMessage(messages.conditionName)}</span>
                  </div>
                  <div className="step-content">
                    <CapInput
                      value={conditionName}
                      placeholder={formatMessage(messages.conditionNamePlaceholder)}
                      onChange={(e) => setConditionName(e.target.value)}
                    />
                    {conditionName.length > 0 && (conditionName.length < 10 || conditionName.length > 50) && (
                      <div style={{ color: '#EA213A', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        Name must be 10–50 characters
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Define Alert Conditions */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">2</div>
                    <span className="step-title">{formatMessage(messages.defineConditions)}</span>
                  </div>
                  <div className="step-content">
                    <div className="form-field">
                      <label>{formatMessage(messages.selectPlatform)}</label>
                      <CapSelect
                        options={platforms.filter((p) => p.value)}
                        value={selectedPlatform}
                        onChange={(val) => { setSelectedPlatform(val); setSelectedMetric(''); }}
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
                          onChange={(e) => setFilterScopeEnabled(e.target.checked)}
                        />
                        <label style={{ marginBottom: 0 }}>{formatMessage(messages.filterScope)}</label>
                      </div>
                      {filterScopeEnabled && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <CapSelect
                            mode="tags"
                            value={filterApis}
                            onChange={setFilterApis}
                            placeholder={formatMessage(messages.filterByApis)}
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
                    <span className="step-title">{formatMessage(messages.setThresholds)}</span>
                  </div>
                  <div className="step-content">
                    {thresholds.map((threshold, index) => (
                      <div key={index} className="threshold-card">
                        <div className="threshold-row">
                          <CapSelect
                            options={PRIORITY_LEVELS}
                            value={threshold.priority}
                            onChange={(val) => handleThresholdChange(index, 'priority', val)}
                            style={{ width: '8rem' }}
                          />
                          <CapSelect
                            options={CONDITION_OPERATORS}
                            value={threshold.operator}
                            onChange={(val) => handleThresholdChange(index, 'operator', val)}
                            style={{ width: '10rem' }}
                          />
                          <CapInput
                            type="number"
                            value={threshold.value}
                            placeholder="Value"
                            onChange={(e) => handleThresholdChange(index, 'value', e.target.value)}
                            style={{ width: '6rem' }}
                          />
                          <CapSelect
                            options={DURATION_TYPES}
                            value={threshold.durationType}
                            onChange={(val) => handleThresholdChange(index, 'durationType', val)}
                            style={{ width: '10rem' }}
                          />
                          <CapInput
                            type="number"
                            value={threshold.durationValue}
                            placeholder="Duration"
                            onChange={(e) => handleThresholdChange(index, 'durationValue', e.target.value)}
                            style={{ width: '5rem' }}
                          />
                          <CapSelect
                            options={TIME_UNITS}
                            value={threshold.timeUnit}
                            onChange={(val) => handleThresholdChange(index, 'timeUnit', val)}
                            style={{ width: '7rem' }}
                          />
                          {thresholds.length > 1 && (
                            <CapButton type="flat" onClick={() => handleRemoveThreshold(index)}>
                              <CapIcon type="close" />
                            </CapButton>
                          )}
                        </div>
                      </div>
                    ))}
                    {thresholds.length < 2 && (
                      <CapButton type="flat" onClick={handleAddThreshold}>
                        + {formatMessage(messages.addThreshold)}
                      </CapButton>
                    )}
                  </div>
                </div>

                {/* Step 4: Notification template */}
                <div className="form-step">
                  <div className="step-header">
                    <div className="step-number">4</div>
                    <span className="step-title">{formatMessage(messages.customizeNotification)}</span>
                    <CapButton type="flat" onClick={() => setShowNotification((p) => !p)}>
                      <CapIcon type={showNotification ? 'chevron-up' : 'chevron-down'} />
                    </CapButton>
                  </div>
                  {showNotification && (
                    <div className="step-content">
                      <div className="notification-section">
                        <div className="form-field">
                          <label>{formatMessage(messages.notificationTitle)}</label>
                          <CapInput value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} />
                        </div>
                        <div className="form-field">
                          <label>{formatMessage(messages.notificationDescription)}</label>
                          <TextArea rows={3} value={notificationDesc} onChange={(e) => setNotificationDesc(e.target.value)} />
                        </div>
                        <CapButton type="flat" onClick={() => { setNotificationTitle(''); setNotificationDesc(''); }}>
                          {formatMessage(messages.resetTemplate)}
                        </CapButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="side-panel-footer">
                <CapButton type="primary" onClick={handleSubmit} disabled={!isFormValid || submitting} loading={submitting}>
                  {editingCondition ? formatMessage(messages.update) : formatMessage(messages.create)}
                </CapButton>
                <CapButton onClick={() => { setSidePanelOpen(false); resetForm(); }}>
                  {formatMessage(messages.cancel)}
                </CapButton>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <CustomModal
          title={formatMessage(messages.deleteCondition)}
          visible={deleteModalVisible}
          onOk={handleDeleteCondition}
          onCancel={() => { setDeleteModalVisible(false); setConditionToDelete(null); }}
          okText={formatMessage(messages.deleteCondition)}
          cancelText={formatMessage(messages.cancel)}
        >
          <p>Are you sure you want to delete <strong>{conditionToDelete?.conditionName}</strong>? This action cannot be undone.</p>
        </CustomModal>

        {/* Settings Modal */}
        <CustomModal
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
        </CustomModal>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(NewRelicConfigurations, styles));
