import React, { useState, useCallback } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapRow,
  CapColumn,
  CapInput,
  CapSelect,
  CapButton,
} from '@capillarytech/cap-ui-library';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';

import DateAndTimePicker from '../../molecules/DateAndTimePicker';
import styles from './styles';
import messages from './messages';

const AppRequestLogs = ({ className, intl: { formatMessage } }) => {
  const [applications] = useState([
    { value: '', label: 'Select Application' },
    { value: 'loyalty-engine-sg', label: 'Loyalty Engine (SG)' },
    { value: 'campaign-manager-sg', label: 'Campaign Manager (SG)' },
    { value: 'engage-plus-sg', label: 'Engage+ (SG)' },
    { value: 'member-care-sg', label: 'Member Care (SG)' },
    { value: 'insights-plus-sg', label: 'Insights+ (SG)' },
  ]);
  const [selectedApp, setSelectedApp] = useState('loyalty-engine-sg');
  const [availableFields, setAvailableFields] = useState([
    { name: 'http.method', label: 'HTTP Method', type: 'text', newrelic_type: 'string' },
    { name: 'response.status', label: 'Response Status', type: 'number', newrelic_type: 'number' },
    { name: 'host', label: 'Host', type: 'text', newrelic_type: 'string' },
  ]);
  const [selectedFields, setSelectedFields] = useState([
    { name: 'request.uri', label: 'Request URI', type: 'text', newrelic_type: 'string', is_request_id: false, preselect: true },
    { name: 'request.headers.requestId', label: 'Request ID', type: 'text', newrelic_type: 'string', is_request_id: true, preselect: true },
    { name: 'duration', label: 'Duration (ms)', type: 'number', newrelic_type: 'number', is_request_id: false, preselect: true },
  ]);
  const [fieldToAdd, setFieldToAdd] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [searchTypes, setSearchTypes] = useState({
    'request.uri': 'exact',
    'request.headers.requestId': 'exact',
    'duration': 'exact',
  });
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [results, setResults] = useState({
    columns: ['request.headers.requestId', 'request.uri', 'duration', 'http.statusCode', 'name'],
    events: [
      { timestamp: 1712998532000, 'request.headers.requestId': 'req-a1b2c3d4', 'request.uri': '/api/v2/loyalty/points/accrue', duration: 45.2, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/POST/v2/loyalty/points/accrue' },
      { timestamp: 1712998535000, 'request.headers.requestId': 'req-e5f6g7h8', 'request.uri': '/api/v2/members/lookup', duration: 32.8, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/GET/v2/members/lookup' },
      { timestamp: 1712998538000, 'request.headers.requestId': 'req-i9j0k1l2', 'request.uri': '/api/v2/transactions/process', duration: 1250.3, 'http.statusCode': 500, name: 'WebTransaction/RestServlet/POST/v2/transactions/process' },
      { timestamp: 1712998540000, 'request.headers.requestId': 'req-m3n4o5p6', 'request.uri': '/api/v2/coupons/validate', duration: 56.1, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/POST/v2/coupons/validate' },
      { timestamp: 1712998542000, 'request.headers.requestId': 'req-q7r8s9t0', 'request.uri': '/api/v2/tiers/calculate', duration: 210.4, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/GET/v2/tiers/calculate' },
      { timestamp: 1712998545000, 'request.headers.requestId': 'req-u1v2w3x4', 'request.uri': '/api/v2/campaigns/active', duration: 78.5, 'http.statusCode': 304, name: 'WebTransaction/RestServlet/GET/v2/campaigns/active' },
      { timestamp: 1712998548000, 'request.headers.requestId': 'req-y5z6a7b8', 'request.uri': '/api/v2/notifications/send', duration: 3420.7, 'http.statusCode': 502, name: 'WebTransaction/RestServlet/POST/v2/notifications/send' },
      { timestamp: 1712998550000, 'request.headers.requestId': 'req-c9d0e1f2', 'request.uri': '/api/v2/members/lookup', duration: 28.9, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/GET/v2/members/lookup' },
      { timestamp: 1712998553000, 'request.headers.requestId': 'req-g3h4i5j6', 'request.uri': '/api/v2/loyalty/points/redeem', duration: 98.4, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/POST/v2/loyalty/points/redeem' },
      { timestamp: 1712998555000, 'request.headers.requestId': 'req-k7l8m9n0', 'request.uri': '/api/v2/reports/summary', duration: 540.2, 'http.statusCode': 200, name: 'WebTransaction/RestServlet/GET/v2/reports/summary' },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [requestIdField, setRequestIdField] = useState('request.headers.requestId');
  const [dateRange, setDateRange] = useState(null);

  const handleAppChange = useCallback((value) => {
    setSelectedApp(value);
    if (!value) return;
    // API call placeholder: fetch available fields for this app
    setAvailableFields([]);
    setSelectedFields([]);
    setFilterValues({});
    setSearchTypes({});
    setResults(null);
  }, []);

  const handleAddField = useCallback(() => {
    if (!fieldToAdd) return;
    const field = availableFields.find((f) => f.name === fieldToAdd);
    if (!field) return;
    setSelectedFields((prev) => [...prev, field]);
    setAvailableFields((prev) => prev.filter((f) => f.name !== fieldToAdd));
    setSearchTypes((prev) => ({ ...prev, [field.name]: 'exact' }));
    setFieldToAdd('');
  }, [fieldToAdd, availableFields]);

  const handleRemoveField = useCallback((fieldName) => {
    const field = selectedFields.find((f) => f.name === fieldName);
    if (!field) return;
    setSelectedFields((prev) => prev.filter((f) => f.name !== fieldName));
    setAvailableFields((prev) =>
      [...prev, field].sort((a, b) => a.label.localeCompare(b.label)),
    );
    setFilterValues((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setSearchTypes((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, [selectedFields]);

  const handleFilterValueChange = useCallback((fieldName, value) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleSearchTypeChange = useCallback((fieldName, value) => {
    setSearchTypes((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleFetchData = useCallback(() => {
    if (!selectedApp) return;
    setLoading(true);
    // API call placeholder
    setTimeout(() => {
      setResults({ events: [], columns: [] });
      setLoading(false);
    }, 500);
  }, [selectedApp, filterValues, searchTypes, dateRange]);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
  }, []);

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return ts;
    }
  };

  const fieldOptions = availableFields.map((f) => ({
    value: f.name,
    label: f.label,
  }));

  return (
    <CapRow className={`${className} app-request-logs`}>
      <CapColumn span={24}>
        <div className="control-panel">
          <DateAndTimePicker onApply={handleDateApply} />
          <CapSelect
            className="app-select"
            options={applications}
            value={selectedApp}
            onChange={handleAppChange}
            placeholder={formatMessage(messages.selectApplication)}
          />
        </div>

        {selectedApp && (
          <div className="filter-section">
            <div className="filter-header">
              <span className="filter-header-title">
                {formatMessage(messages.filterOptions, { appName: selectedApp })}
              </span>
              <button
                className="filter-toggle"
                onClick={() => setFiltersCollapsed((p) => !p)}
              >
                {filtersCollapsed
                  ? formatMessage(messages.expandFilters)
                  : formatMessage(messages.collapseFilters)}
                <CapIcon
                  type={filtersCollapsed ? 'chevron-down' : 'chevron-up'}
                />
              </button>
            </div>

            {!filtersCollapsed && (
              <div className="filter-body">
                <div className="field-selector-row">
                  <CapSelect
                    className="field-dropdown"
                    options={[
                      {
                        value: '',
                        label: formatMessage(messages.selectFieldToAdd),
                      },
                      ...fieldOptions,
                    ]}
                    value={fieldToAdd}
                    onChange={setFieldToAdd}
                  />
                  <CapButton
                    type="secondary"
                    onClick={handleAddField}
                    disabled={!fieldToAdd}
                  >
                    {formatMessage(messages.addFilter)}
                  </CapButton>
                </div>

                <div className="selected-fields">
                  {selectedFields.length === 0 && (
                    <div className="filter-placeholder">
                      {formatMessage(messages.noFiltersSelected)}
                    </div>
                  )}
                  {selectedFields.map((field) => (
                    <div key={field.name} className="filter-field">
                      <span className="filter-field-label">{field.label}</span>
                      {field.newrelic_type === 'string' && (
                        <div className="search-type-group">
                          <label>
                            <input
                              type="radio"
                              name={`${field.name}_type`}
                              checked={searchTypes[field.name] === 'exact'}
                              onChange={() =>
                                handleSearchTypeChange(field.name, 'exact')
                              }
                            />
                            Exact
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`${field.name}_type`}
                              checked={searchTypes[field.name] === 'like'}
                              onChange={() =>
                                handleSearchTypeChange(field.name, 'like')
                              }
                            />
                            LIKE
                          </label>
                        </div>
                      )}
                      <CapInput
                        className="filter-input"
                        value={filterValues[field.name] || ''}
                        placeholder={`Filter by ${field.label}`}
                        onChange={(e) =>
                          handleFilterValueChange(field.name, e.target.value)
                        }
                      />
                      <CapButton
                        type="flat"
                        onClick={() => handleRemoveField(field.name)}
                      >
                        <CapIcon type="close" />
                      </CapButton>
                    </div>
                  ))}
                </div>

                <CapButton
                  type="primary"
                  onClick={handleFetchData}
                  style={{ marginTop: '0.75rem' }}
                >
                  {formatMessage(messages.fetchData)}
                </CapButton>
              </div>
            )}
          </div>
        )}

        {loading && <CapSpin />}

        {!loading && !selectedApp && (
          <div className="empty-state">
            {formatMessage(messages.selectApp)}
          </div>
        )}

        {!loading && results && (
          <div className="results-area">
            {results.events && results.events.length > 0 ? (
              <>
                <div className="results-count">
                  {formatMessage(messages.logsFound, {
                    count: results.events.length,
                  })}
                </div>
                <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        {(results.columns || []).map((col) => (
                          <th
                            key={col}
                            className={
                              col === requestIdField ? 'request-id-cell' : ''
                            }
                          >
                            {col
                              .replace(/\./g, ' ')
                              .replace(/(^|\s)\S/g, (l) => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.events.map((event, i) => (
                        <tr key={i}>
                          <td>{formatTimestamp(event.timestamp)}</td>
                          {(results.columns || []).map((col) => (
                            <td
                              key={col}
                              className={
                                col === requestIdField ? 'request-id-cell' : ''
                              }
                            >
                              {col === requestIdField && event[col] ? (
                                <span className="request-id-link">
                                  {event[col]}
                                </span>
                              ) : (
                                event[col] ?? ''
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="empty-state">
                {formatMessage(messages.noLogs)}
              </div>
            )}
          </div>
        )}
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(AppRequestLogs, styles));
