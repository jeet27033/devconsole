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
import {
  DEFAULT_LOG_LIMIT,
  MIN_LOG_LIMIT,
  SEARCH_OPERATORS,
} from './constants';

const LogViewer = ({ className, intl: { formatMessage } }) => {
  const [extensions] = useState([
    { value: 'None', label: 'Select Extension' },
    { value: 'loyalty-engine', label: 'Loyalty Engine' },
    { value: 'campaign-manager', label: 'Campaign Manager' },
    { value: 'engage-plus', label: 'Engage+' },
    { value: 'insights-plus', label: 'Insights+' },
    { value: 'member-care', label: 'Member Care' },
  ]);
  const [selectedExtension, setSelectedExtension] = useState('loyalty-engine');
  const [logLimit, setLogLimit] = useState(DEFAULT_LOG_LIMIT);
  const [searchTerms, setSearchTerms] = useState([
    { value: '', operator: 'contains' },
  ]);
  const [logs, setLogs] = useState([
    { message: '2026-04-13 10:15:32.451 [INFO] LoyaltyEngine - Processing points accrual for member #82451. Transaction ID: TXN-20260413-001. Points earned: 250.', detail: 'Request: POST /api/v2/loyalty/points/accrue\nHeaders: { "Content-Type": "application/json", "X-Request-Id": "req-abc123" }\nPayload: { "memberId": 82451, "transactionAmount": 2500, "programId": "LP-001" }\nResponse: 200 OK - Points accrued successfully.' },
    { message: '2026-04-13 10:15:33.102 [WARN] LoyaltyEngine - Rate limit approaching for org 15064. Current: 850/1000 requests per minute.', detail: 'Rate limiter stats:\n  Window: 60s\n  Current count: 850\n  Limit: 1000\n  Remaining: 150\n  Reset at: 2026-04-13T10:16:32Z' },
    { message: '2026-04-13 10:15:34.789 [ERROR] LoyaltyEngine - Failed to fetch tier details for member #99102. Connection timeout after 30000ms to tier-service.internal:8443.', detail: 'java.net.SocketTimeoutException: connect timed out\n  at java.net.PlainSocketImpl.socketConnect(Native Method)\n  at com.capillary.loyalty.service.TierService.getMemberTier(TierService.java:142)\n  at com.capillary.loyalty.controller.MemberController.getDetails(MemberController.java:87)\nRetry attempt: 3/3\nCircuit breaker status: HALF_OPEN' },
    { message: '2026-04-13 10:15:35.234 [INFO] LoyaltyEngine - Batch job "points-expiry-check" completed. Processed: 12,450 members. Expired: 342 point entries totaling 1,245,000 points.', detail: 'Job: points-expiry-check\nStart: 2026-04-13T10:10:00Z\nEnd: 2026-04-13T10:15:35Z\nDuration: 5m 35s\nProcessed: 12,450\nExpired entries: 342\nTotal points expired: 1,245,000\nErrors: 0' },
    { message: '2026-04-13 10:15:36.567 [ERROR] LoyaltyEngine - Duplicate transaction detected. TXN-20260413-002 already processed for member #55731. Idempotency key collision.', detail: 'Transaction ID: TXN-20260413-002\nMember: 55731\nOriginal processed at: 2026-04-13T10:14:22Z\nDuplicate attempt at: 2026-04-13T10:15:36Z\nIdempotency key: idem-key-xyz789\nAction: Rejected' },
    { message: '2026-04-13 10:15:37.891 [INFO] LoyaltyEngine - Webhook delivered successfully to https://partner-api.example.com/callbacks/loyalty. Status: 200. Latency: 145ms.', detail: 'Webhook event: POINTS_ACCRUED\nDestination: https://partner-api.example.com/callbacks/loyalty\nMethod: POST\nStatus: 200 OK\nLatency: 145ms\nRetries: 0\nPayload size: 1.2KB' },
    { message: '2026-04-13 10:15:38.445 [WARN] LoyaltyEngine - Slow query detected on points_ledger table. Query took 4,521ms. Org: 15064, Query: SELECT * FROM points_ledger WHERE member_id = 82451.', detail: 'Query: SELECT * FROM points_ledger WHERE member_id = 82451 AND org_id = 15064\nExecution time: 4,521ms\nRows scanned: 1,250,000\nRows returned: 847\nIndex used: idx_member_org\nSuggestion: Consider adding composite index on (member_id, org_id, created_at)' },
    { message: '2026-04-13 10:15:39.112 [INFO] LoyaltyEngine - Cache hit ratio for last 5 minutes: 94.2%. Total requests: 15,230. Cache hits: 14,347. Cache misses: 883.', detail: 'Cache stats (5m window):\n  Total requests: 15,230\n  Hits: 14,347 (94.2%)\n  Misses: 883 (5.8%)\n  Evictions: 12\n  Avg hit latency: 2ms\n  Avg miss latency: 85ms\n  Memory used: 256MB / 512MB' },
  ]);
  const [loading, setLoading] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [timeChunks, setTimeChunks] = useState([
    { label: '10:00 - 11:00', empty: false },
    { label: '09:00 - 10:00', empty: false },
    { label: '08:00 - 09:00', empty: true },
    { label: '07:00 - 08:00', empty: true },
  ]);
  const [activeChunk, setActiveChunk] = useState('10:00 - 11:00');
  const [dateRange, setDateRange] = useState(null);

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

  const handleSearch = useCallback(() => {
    if (selectedExtension === 'None') return;
    setLoading(true);
    // API call placeholder - integrate with backend
    setTimeout(() => {
      setLogs([]);
      setLoading(false);
    }, 500);
  }, [selectedExtension, logLimit, searchTerms, dateRange]);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleToggleLog = useCallback((index) => {
    setExpandedLog((prev) => (prev === index ? null : index));
  }, []);

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
              options={extensions}
              value={selectedExtension}
              onChange={setSelectedExtension}
              style={{"width": "100%"}}
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
                  style={{"width": "100%"}}
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
            <CapButton type="primary" onClick={handleSearch}>
              {formatMessage(messages.searchLogs)}
            </CapButton>
          </div>
        </div>

        {loading && <CapSpin />}

        {!loading && logs.length === 0 && (
          <div className="empty-state">
            {formatMessage(messages.noLogsFound)}
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="logs-container">
            <div className="logs-main">
              {activeChunk && (
                <div className="current-chunk-label">{activeChunk}</div>
              )}
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="log-entry"
                  onClick={() => handleToggleLog(index)}
                >
                  <div className="log-summary">{log.message || log}</div>
                  {expandedLog === index && (
                    <pre className="log-detail">
                      {typeof log === 'object'
                        ? JSON.stringify(log, null, 2)
                        : log}
                    </pre>
                  )}
                </div>
              ))}
            </div>
            {timeChunks.length > 0 && (
              <div className="time-chunks-sidebar">
                {timeChunks.map((chunk, i) => (
                  <button
                    key={i}
                    className={`time-chunk-btn ${activeChunk === chunk.label ? 'active' : ''} ${chunk.empty ? 'empty' : ''}`}
                    onClick={() => setActiveChunk(chunk.label)}
                  >
                    {chunk.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(LogViewer, styles));
