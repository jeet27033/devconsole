import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
import CapModal from '@capillarytech/cap-ui-library/CapModal';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';

import DateAndTimePicker from '../../molecules/DateAndTimePicker';
import styles from './styles';
import messages from './messages';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  DEFAULT_STATUS,
  ISSUE_TABLE_COLUMNS,
} from './constants';

const getViolationDuration = (startTs, endTs) => {
  if (!startTs) return '-';
  const end = endTs || Date.now();
  const diffMs = end - startTs;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
};

const NewRelicIssues = ({ className, intl: { formatMessage } }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [platforms, setPlatforms] = useState([
    { value: '', label: 'All' },
    { value: 'Loyalty Engine', label: 'Loyalty Engine' },
    { value: 'Campaign Manager', label: 'Campaign Manager' },
    { value: 'Engage+', label: 'Engage+' },
    { value: 'Insights+', label: 'Insights+' },
  ]);
  const [issues, setIssues] = useState([
    { id: 'iss-001', status: 'Active', acknowledgedBy: null, priority: 'Critical', triggered: 1712998200000, closedAt: null, conditionName: 'High Error Rate - Loyalty Points API', platform: 'Loyalty Engine', accountId: '67421' },
    { id: 'iss-002', status: 'Active', acknowledgedBy: 'jeet.patel', priority: 'High', triggered: 1712994600000, closedAt: null, conditionName: 'Latency P95 > 500ms - Member Lookup', platform: 'Loyalty Engine', accountId: '67421' },
    { id: 'iss-003', status: 'Active', acknowledgedBy: null, priority: 'Critical', triggered: 1712991000000, closedAt: null, conditionName: 'Transaction Processing Timeout', platform: 'Campaign Manager', accountId: '67421' },
    { id: 'iss-004', status: 'Active', acknowledgedBy: 'dev.ops', priority: 'Medium', triggered: 1712984400000, closedAt: null, conditionName: 'Elevated 4xx Error Rate - Coupon Validation', platform: 'Engage+', accountId: '67421' },
    { id: 'iss-005', status: 'Closed', acknowledgedBy: 'admin.user', priority: 'High', triggered: 1712952000000, closedAt: 1712966400000, conditionName: 'Database Connection Pool Exhausted', platform: 'Loyalty Engine', accountId: '67421' },
    { id: 'iss-006', status: 'Active', acknowledgedBy: null, priority: 'Low', triggered: 1712980800000, closedAt: null, conditionName: 'Cache Hit Ratio Below 90%', platform: 'Insights+', accountId: '67421' },
    { id: 'iss-007', status: 'Closed', acknowledgedBy: 'jeet.patel', priority: 'Critical', triggered: 1712937600000, closedAt: 1712948400000, conditionName: 'Service Unavailable - Gateway 503', platform: 'Campaign Manager', accountId: '67421' },
    { id: 'iss-008', status: 'Active', acknowledgedBy: null, priority: 'Medium', triggered: 1712977200000, closedAt: null, conditionName: 'Memory Usage > 85% - Notification Worker', platform: 'Engage+', accountId: '67421' },
    { id: 'iss-009', status: 'Closed', acknowledgedBy: 'dev.ops', priority: 'Low', triggered: 1712916000000, closedAt: 1712923200000, conditionName: 'Slow Query Detected - Reports Service', platform: 'Insights+', accountId: '67421' },
    { id: 'iss-010', status: 'Active', acknowledgedBy: 'admin.user', priority: 'High', triggered: 1712973600000, closedAt: null, conditionName: 'Spike in Error Rate - Tier Calculation', platform: 'Loyalty Engine', accountId: '67421' },
  ]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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

  const filteredIssues = useMemo(() => {
    let result = issues;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) =>
        i.conditionName?.toLowerCase().includes(q),
      );
    }
    if (statusFilter) {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (priorityFilter) {
      result = result.filter((i) => i.priority === priorityFilter);
    }
    if (platformFilter) {
      result = result.filter((i) => i.platform === platformFilter);
    }
    return result;
  }, [issues, searchQuery, statusFilter, priorityFilter, platformFilter]);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
    // API call placeholder: fetch issues with date range
  }, []);

  const handleAcknowledge = useCallback((issue) => {
    // API call placeholder: POST alert-management/backend/account/{accountId}/issues/action
    setOpenMenuId(null);
  }, []);

  const handleCloseIssue = useCallback((issueId) => {
    setSelectedIssueId(issueId);
    setCloseModalVisible(true);
    setOpenMenuId(null);
  }, []);

  const handleConfirmClose = useCallback(() => {
    // API call placeholder: POST alert-management/backend/account/{accountId}/issues/action with action: 'close'
    setCloseModalVisible(false);
    setSelectedIssueId(null);
  }, [selectedIssueId]);

  return (
    <CapRow className={`${className} newrelic-issues`}>
      <CapColumn span={24}>
        <div className="filters-section">
          <CapInput
            className="search-input"
            value={searchQuery}
            placeholder={formatMessage(messages.searchPlaceholder)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DateAndTimePicker onApply={handleDateApply} />
          <CapSelect
            className="filter-select"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <CapSelect
            className="filter-select"
            options={PRIORITY_OPTIONS}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
          <CapSelect
            className="platform-select"
            options={platforms}
            value={platformFilter}
            onChange={setPlatformFilter}
          />
        </div>

        {loading && <CapSpin />}

        {!loading && (
          <div className="issues-table-container">
            <table className="issues-table">
              <thead>
                <tr>
                  {ISSUE_TABLE_COLUMNS.map((col) => (
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
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={ISSUE_TABLE_COLUMNS.length}>
                      <div className="empty-state">
                        {formatMessage(messages.noIssues)}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className={
                        issue.status === 'Closed' ? 'closed-row' : ''
                      }
                    >
                      <td>
                        <div className="status-cell">
                          <div className="status-label">
                            <span
                              className={`status-dot ${issue.status === 'Active' ? 'active' : 'closed'}`}
                            />
                            {issue.status}
                          </div>
                          {issue.acknowledgedBy && (
                            <div className="action-taken-by">
                              {formatMessage(messages.acknowledgedBy, {
                                user: issue.acknowledgedBy,
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className={`priority-badge priority-${issue.priority}`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {issue.triggered
                          ? new Date(issue.triggered).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        <div className="condition-cell">
                          <div className="condition-name">
                            {issue.conditionName}
                          </div>
                          <div className="condition-platform">
                            {issue.platform}
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {getViolationDuration(
                          issue.triggered,
                          issue.closedAt,
                        )}
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        {issue.status !== 'Closed' && (
                          <>
                            <button
                              className="action-btn"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === issue.id ? null : issue.id,
                                )
                              }
                            >
                              <CapIcon type="more" />
                            </button>
                            {openMenuId === issue.id && (
                              <div className="action-menu" ref={menuRef}>
                                <button
                                  className="action-menu-item"
                                  onClick={() => handleAcknowledge(issue)}
                                >
                                  <CapIcon type="check" />
                                  {issue.acknowledgedBy
                                    ? formatMessage(messages.unacknowledge)
                                    : formatMessage(messages.acknowledge)}
                                </button>
                                <button
                                  className="action-menu-item close-action"
                                  onClick={() =>
                                    handleCloseIssue(issue.id)
                                  }
                                >
                                  <CapIcon type="check-circle" />
                                  {formatMessage(messages.closeIssue)}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Close Issue Confirmation Modal */}
        <CapModal
          title={formatMessage(messages.closeIssueTitle)}
          visible={closeModalVisible}
          onOk={handleConfirmClose}
          onCancel={() => {
            setCloseModalVisible(false);
            setSelectedIssueId(null);
          }}
          okText={formatMessage(messages.yesClose)}
          cancelText={formatMessage(messages.cancel)}
        >
          <p>{formatMessage(messages.closeIssueConfirm)}</p>
          <p>{formatMessage(messages.areYouSure)}</p>
        </CapModal>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(NewRelicIssues, styles));
