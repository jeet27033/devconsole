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
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';

import CustomModal from '../../molecules/CustomModal';
import DateAndTimePicker from '../../molecules/DateAndTimePicker';
import styles from './styles';
import messages from './messages';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  DEFAULT_STATUS,
  ISSUE_TABLE_COLUMNS,
} from './constants';
import {
  getNewRelicIssues,
  newRelicIssueAction,
  getNewRelicPlatforms,
} from '../../../services/api';

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

const getTimeAgo = (ts) => {
  if (!ts) return '-';
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NewRelicIssues = ({ className, intl: { formatMessage } }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [platforms, setPlatforms] = useState([{ value: '', label: 'All' }]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const dateRangeRef = useRef(null);

  const fetchPlatforms = useCallback(async () => {
    try {
      const res = await getNewRelicPlatforms();
      const data = res?.data?.data ?? res?.data ?? [];
      const opts = [{ value: '', label: 'All' }, ...data.map((p) => ({ value: p.label, label: p.label }))];
      setPlatforms(opts);
    } catch (e) {
      // keep default
    }
  }, []);

  const fetchIssues = useCallback(async ({ status, priority, platform, dr } = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const st = status !== undefined ? status : statusFilter;
      const prio = priority !== undefined ? priority : priorityFilter;
      const plat = platform !== undefined ? platform : platformFilter;
      const range = dr !== undefined ? dr : dateRangeRef.current;
      if (st) params.set('status', st);
      if (prio) params.set('priority', prio);
      if (plat) params.set('platform', plat);
      if (range?.startDate) params.set('startTime', String(range.startDate.valueOf()));
      if (range?.endDate) params.set('endTime', String(range.endDate.valueOf()));
      const qs = params.toString();
      const res = await getNewRelicIssues(qs ? `?${qs}` : '');
      const data = res?.data?.data ?? res?.data ?? {};
      setIssues(data.issues ?? []);
    } catch (e) {
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, platformFilter]);

  useEffect(() => { fetchPlatforms(); fetchIssues(); }, []);

  useEffect(() => { fetchIssues(); }, [statusFilter, priorityFilter, platformFilter]);

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const filteredIssues = useMemo(() => {
    if (!searchQuery) return issues;
    const q = searchQuery.toLowerCase();
    return issues.filter((i) => i.conditionName?.toLowerCase().includes(q));
  }, [issues, searchQuery]);

  const handleDateApply = useCallback((range) => {
    dateRangeRef.current = range;
    setDateRange(range);
    fetchIssues({ dr: range });
  }, [fetchIssues]);

  const handleAcknowledge = useCallback(async (issue) => {
    setOpenMenuId(null);
    try {
      await newRelicIssueAction(issue.id, { action: 'acknowledge' });
      setIssues((prev) =>
        prev.map((i) => i.id === issue.id ? { ...i, acknowledgedBy: i.acknowledgedBy ? null : 'me' } : i),
      );
    } catch (e) { /* ignore */ }
  }, []);

  const handleCloseIssue = useCallback((issue) => {
    setSelectedIssue(issue);
    setCloseModalVisible(true);
    setOpenMenuId(null);
  }, []);

  const handleConfirmClose = useCallback(async () => {
    if (!selectedIssue) return;
    try {
      await newRelicIssueAction(selectedIssue.id, { action: 'close' });
      setIssues((prev) =>
        prev.map((i) => i.id === selectedIssue.id ? { ...i, status: 'Closed', closedAt: Date.now() } : i),
      );
    } catch (e) { /* ignore */ } finally {
      setCloseModalVisible(false);
      setSelectedIssue(null);
    }
  }, [selectedIssue]);

  return (
    <CapRow className={`${className} newrelic-issues`}>
      <CapColumn span={24}>
        <div className="filters-section">
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.search)}</span>
            <CapInput
              className="search-input"
              value={searchQuery}
              placeholder={formatMessage(messages.searchPlaceholder)}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.dateTimeRange)}</span>
            <DateAndTimePicker onApply={handleDateApply} />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.status)}</span>
            <CapSelect className="filter-select" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.priority)}</span>
            <CapSelect className="filter-select" options={PRIORITY_OPTIONS} value={priorityFilter} onChange={setPriorityFilter} />
          </div>
          <div className="filter-field">
            <span className="filter-label">{formatMessage(messages.platform)}</span>
            <CapSelect className="platform-select" options={platforms} value={platformFilter} onChange={setPlatformFilter} />
          </div>
        </div>

        {loading && <CapSpin />}

        {!loading && (
          <div className="issues-table-container">
            <table className="issues-table">
              <thead>
                <tr>
                  {ISSUE_TABLE_COLUMNS.map((col) => (
                    <th key={col.dataIndex} style={{ width: col.width, textAlign: col.align || 'left' }}>
                      <div>{col.title}</div>
                      {col.subTitle && <div className="sub-header">{col.subTitle}</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={ISSUE_TABLE_COLUMNS.length}>
                      <div className="empty-state">{formatMessage(messages.noIssues)}</div>
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className={issue.status === 'Closed' ? 'closed-row' : ''}>
                      <td>
                        <div className="status-cell">
                          <div className="status-label">
                            <span className={`status-dot ${issue.status === 'Active' ? 'active' : 'closed'}`} />
                            {issue.status}
                          </div>
                          {issue.acknowledgedBy && (
                            <div className="action-taken-by">
                              {formatMessage(messages.acknowledgedBy, { user: issue.acknowledgedBy })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`priority-badge priority-${issue.priority}`}>{issue.priority}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{getTimeAgo(issue.triggered)}</td>
                      <td>
                        <div className="condition-cell">
                          <div className="condition-name">{issue.conditionName}</div>
                          <div className="condition-platform">{issue.platform}</div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{getViolationDuration(issue.triggered, issue.closedAt)}</td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        {issue.status !== 'Closed' && (
                          <>
                            <button
                              className="action-btn"
                              onClick={() => setOpenMenuId(openMenuId === issue.id ? null : issue.id)}
                            >
                              <CapIcon type="more" />
                            </button>
                            {openMenuId === issue.id && (
                              <div className="action-menu" ref={menuRef}>
                                <button className="action-menu-item" onClick={() => handleAcknowledge(issue)}>
                                  <CapIcon type="check" />
                                  {issue.acknowledgedBy ? formatMessage(messages.unacknowledge) : formatMessage(messages.acknowledge)}
                                </button>
                                <button className="action-menu-item close-action" onClick={() => handleCloseIssue(issue)}>
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

        <CustomModal
          title={formatMessage(messages.closeIssueTitle)}
          visible={closeModalVisible}
          onOk={handleConfirmClose}
          onCancel={() => { setCloseModalVisible(false); setSelectedIssue(null); }}
          okText={formatMessage(messages.yesClose)}
          cancelText={formatMessage(messages.cancel)}
        >
          <p>{formatMessage(messages.closeIssueConfirm)}</p>
          <p>{formatMessage(messages.areYouSure)}</p>
        </CustomModal>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(NewRelicIssues, styles));
