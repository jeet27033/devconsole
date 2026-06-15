import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import {
  injectSaga,
  injectReducer,
  withStyles,
} from '@capillarytech/vulcan-react-sdk/utils';
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
import { formatTimestamp } from '../../../helper/dateHelper';
import { REQUEST } from '../../pages/App/constants';
import styles from './styles';
import messages from './messages';
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import { REDUCER_KEY } from './constants';
import {
  makeSelectExtensionsMap,
  makeSelectFetchingExtensions,
  makeSelectAppConfig,
  makeSelectFetchingAppFields,
} from './selectors';

const AppRequestLogs = ({
  className,
  intl: { formatMessage },
  extensionsMap,
  fetchingExtensions,
  appConfig,
  fetchingAppFields,
  actions: boundActions,
}) => {
  useEffect(() => {
    boundActions.getExtensionsList();
  }, [boundActions]);

  const extensionOptions = useMemo(
    () =>
      Object.keys(extensionsMap || {}).map((ext) => ({
        key: ext,
        value: ext,
        label: ext,
      })),
    [extensionsMap],
  );

  const [selectedApp, setSelectedApp] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldToAdd, setFieldToAdd] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [searchTypes, setSearchTypes] = useState({});
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestIdField, setRequestIdField] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const handleAppChange = useCallback((value) => {
    setSelectedApp(value);
    setAvailableFields([]);
    setSelectedFields([]);
    setFilterValues({});
    setSearchTypes({});
    setResults(null);
    if (!value) return;
    boundActions.getAppFields(value);
  }, [boundActions]);

  useEffect(() => {
    if (!appConfig || !appConfig.field_metadata) return;
    const fieldMeta = appConfig.field_metadata;
    const allFields = Object.entries(fieldMeta).map(([name, meta]) => ({
      name,
      label: name,
      newrelic_type: meta.newrelic_type || null,
      is_request_id: meta.is_request_id || false,
      preselect: meta.preselect || false,
    }));

    const requestId = allFields.find((f) => f.is_request_id);
    if (requestId) setRequestIdField(requestId.name);

    const preselectFields = allFields.filter((f) => f.preselect);
    const remainingFields = allFields
      .filter((f) => !f.preselect)
      .sort((a, b) => a.label.localeCompare(b.label));

    setSelectedFields(preselectFields);
    setAvailableFields(remainingFields);
    const initSearchTypes = {};
    preselectFields.forEach((f) => {
      initSearchTypes[f.name] = 'exact';
    });
    setSearchTypes(initSearchTypes);
  }, [appConfig]);

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

  const fieldOptions = availableFields.map((f) => ({
    value: f.name,
    label: f.label,
  }));

  return (
    <CapRow className={`${className} app-request-logs`}>
      <CapColumn span={24}>
        <div className="control-panel">
          <div className="control-item">
            <span className="control-label">
              {formatMessage(messages.dateTimeRange)}
            </span>
            <DateAndTimePicker onApply={handleDateApply} />
          </div>
          <div className="control-item">
            <span className="control-label">
              {formatMessage(messages.extension)}
            </span>
            <CapSelect
              className="app-select"
              options={extensionOptions}
              value={selectedApp || undefined}
              onChange={handleAppChange}
              loading={fetchingExtensions === REQUEST}
              placeholder={formatMessage(messages.selectApplication)}
              style={{ width: '100%' }}
            />
          </div>
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
                    loading={fetchingAppFields === REQUEST}
                    style={{ width: '100%' }}
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

AppRequestLogs.propTypes = {
  className: PropTypes.string,
  extensionsMap: PropTypes.object,
  fetchingExtensions: PropTypes.string,
  appConfig: PropTypes.object,
  fetchingAppFields: PropTypes.string,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  extensionsMap: makeSelectExtensionsMap(),
  fetchingExtensions: makeSelectFetchingExtensions(),
  appConfig: makeSelectAppConfig(),
  fetchingAppFields: makeSelectFetchingAppFields(),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = sagas.map((saga, index) =>
  injectSaga({ key: `${REDUCER_KEY}-${index}`, saga }),
);

const withReducer = injectReducer({ key: REDUCER_KEY, reducer });

export default compose(
  ...withSaga,
  withReducer,
  withConnect,
)(injectIntl(withStyles(AppRequestLogs, styles)));
