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
import { REQUEST } from '../../pages/App/constants';
import styles from './styles';
import messages from './messages';
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import {
  DEFAULT_LOG_LIMIT,
  MIN_LOG_LIMIT,
  SEARCH_OPERATORS,
  REDUCER_KEY,
} from './constants';
import {
  makeSelectLogs,
  makeSelectFetchingLogs,
  makeSelectTotalEntries,
  makeSelectExtensionsMap,
  makeSelectFetchingExtensions,
  makeSelectLogsError,
} from './selectors';

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);
  return { startDate, endDate };
};

const LogViewer = ({
  className,
  intl: { formatMessage },
  logs,
  fetchingLogs,
  totalEntries,
  extensionsMap,
  fetchingExtensions,
  logsError,
  actions: boundActions,
}) => {
  const [selectedExtension, setSelectedExtension] = useState(null);

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
  const [logLimit, setLogLimit] = useState(DEFAULT_LOG_LIMIT);
  const [searchTerms, setSearchTerms] = useState([
    { value: '', operator: 'contains' },
  ]);
  const [expandedLog, setExpandedLog] = useState(null);
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAddSearchTerm = useCallback(() => {
    setSearchTerms((prev) => [...prev, { value: '', operator: 'contains' }]);
  }, []);

  const handleRemoveSearchTerm = useCallback((index) => {
    setSearchTerms((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSearchTermChange = useCallback((index, field, value) => {
    setSearchTerms((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }, []);

  const isLoading = fetchingLogs === REQUEST;

  const handleSearch = useCallback(() => {
    if (!selectedExtension || !dateRange || isLoading) return;
    const trimmedTerms = searchTerms
      .map((t) => ({ term: (t.value || '').trim(), operator: t.operator }))
      .filter((t) => t.term);

    const appName = extensionsMap?.[selectedExtension] || selectedExtension;

    setHasSearched(true);
    boundActions.fetchLokiLogs({
      appName,
      extension: selectedExtension,
      search: trimmedTerms.length > 0 ? JSON.stringify(trimmedTerms) : '',
      startTime: dateRange.startDate.getTime(),
      endTime: dateRange.endDate.getTime(),
      isFullLogsChecked: false,
      type: 'app',
      limit: logLimit,
    });
  }, [
    selectedExtension,
    extensionsMap,
    logLimit,
    searchTerms,
    dateRange,
    isLoading,
    boundActions,
  ]);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleToggleLog = useCallback((index) => {
    setExpandedLog((prev) => (prev === index ? null : index));
  }, []);

  const hasLogs = logs && logs.length > 0;

  const renderedLogs = useMemo(
    () =>
      (logs || []).map((log, index) => (
        <div
          key={index}
          className="log-entry"
          onClick={() => handleToggleLog(index)}
        >
          <div className="log-summary">{log}</div>
          {expandedLog === index && <pre className="log-detail">{log}</pre>}
        </div>
      )),
    [logs, expandedLog, handleToggleLog],
  );

  return (
    <CapRow className={`${className} log-viewer`}>
      <CapColumn span={24}>
        <div className="log-viewer-form">
          <div className="form-field">
            <label>{formatMessage(messages.dateTimeRange)}</label>
            <DateAndTimePicker onApply={handleDateApply} />
          </div>
          <div className="form-field">
            <label>{formatMessage(messages.extension)}</label>
            <CapSelect
              className="extension-select"
              options={extensionOptions}
              value={selectedExtension || undefined}
              onChange={setSelectedExtension}
              loading={fetchingExtensions === REQUEST}
              placeholder={formatMessage(messages.selectExtension)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-field">
            <label>{formatMessage(messages.logLimit)}</label>
            <CapInput
              className="limit-input"
              type="number"
              value={logLimit}
              placeholder={formatMessage(messages.minLogLimit)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setLogLimit(val >= MIN_LOG_LIMIT ? val : MIN_LOG_LIMIT);
              }}
            />
          </div>
        </div>

        <div className="search-section">
          <div className="search-section-label">
            {formatMessage(messages.searchTerms)}
          </div>
          <div className="search-terms-grid">
            {searchTerms.map((term, index) => (
              <div key={index} className="search-term-row">
                <CapInput
                  value={term.value}
                  placeholder={formatMessage(messages.searchPlaceholder)}
                  onChange={(e) =>
                    handleSearchTermChange(index, 'value', e.target.value)
                  }
                />
                <CapSelect
                  className="operator-select"
                  options={SEARCH_OPERATORS}
                  value={term.operator}
                  onChange={(val) =>
                    handleSearchTermChange(index, 'operator', val)
                  }
                  style={{ width: '100%' }}
                />
                {searchTerms.length > 1 && (
                  <CapButton
                    type="flat"
                    onClick={() => handleRemoveSearchTerm(index)}
                  >
                    <CapIcon type="close" />
                  </CapButton>
                )}
              </div>
            ))}
          </div>
          <div className="search-hint">
            {formatMessage(messages.searchTermHint)}
          </div>
          <div className="search-actions">
            <CapButton type="secondary" onClick={handleAddSearchTerm}>
              {formatMessage(messages.addSearchTerm)}
            </CapButton>
            <CapButton
              type="primary"
              onClick={handleSearch}
              loading={isLoading}
              disabled={!selectedExtension || !dateRange}
            >
              {formatMessage(messages.searchLogs)}
            </CapButton>
          </div>
        </div>

        {isLoading && (
          <div className="logs-loading">
            <CapSpin />
          </div>
        )}

        {!isLoading && logsError && (
          <div className="logs-error">
            {`Failed to fetch logs: ${
              typeof logsError === 'string'
                ? logsError
                : logsError?.message || 'Network error'
            }`}
          </div>
        )}

        {!isLoading && !logsError && !hasLogs && hasSearched && (
          <div className="empty-state">
            {formatMessage(messages.noLogsFound)}
          </div>
        )}

        {!isLoading && hasLogs && (
          <div className="logs-container">
            <div className="logs-main">
              <div className="logs-summary-bar">
                {`Showing ${logs.length} of ${totalEntries} entries`}
              </div>
              {renderedLogs}
            </div>
          </div>
        )}
      </CapColumn>
    </CapRow>
  );
};

LogViewer.propTypes = {
  className: PropTypes.string,
  logs: PropTypes.array,
  fetchingLogs: PropTypes.string,
  totalEntries: PropTypes.number,
  extensionsMap: PropTypes.object,
  fetchingExtensions: PropTypes.string,
  logsError: PropTypes.any,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  logs: makeSelectLogs(),
  fetchingLogs: makeSelectFetchingLogs(),
  totalEntries: makeSelectTotalEntries(),
  extensionsMap: makeSelectExtensionsMap(),
  fetchingExtensions: makeSelectFetchingExtensions(),
  logsError: makeSelectLogsError(),
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
)(injectIntl(withStyles(LogViewer, styles)));
