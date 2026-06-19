import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { injectSaga, injectReducer, withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapRow,
  CapColumn,
  CapSelect,
  CapTable,
  CapDropdown,
  CapMenu,
} from '@capillarytech/cap-ui-library';
import CapButton from '@capillarytech/cap-ui-library/CapButton';

import styles from './styles';
import messages from './messages';
import { REDUCER_KEY } from './constants';
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import {
  makeSelectApps,
  makeSelectFetchingApps,
  makeSelectIssues,
  makeSelectProjectId,
  makeSelectFetchingIssues,
} from './selectors';
import { REQUEST } from '../../pages/App/constants';
import DateAndTimePicker from '../../molecules/DateAndTimePicker';

const { Item: MenuItem } = CapMenu;

const SEVERITY_DISPLAY = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

const formatLastSeen = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const BugsnagIssueListing = ({
  className,
  intl: { formatMessage },
  apps,
  fetchingApps,
  issues,
  projectId,
  fetchingIssues,
  getApplications,
  getBugsnagIssues,
  updateBugsnagErrorStatus,
}) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    getApplications();
  }, []);

  useEffect(() => {
    if (apps.length > 0 && !selectedApp) {
      setSelectedApp(apps[0].name);
    }
  }, [apps]);

  useEffect(() => {
    getBugsnagIssues({
      vulcanApp: selectedApp || undefined,
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    });
  }, [selectedApp, dateRange]);

  const handleAppChange = useCallback((value) => {
    setSelectedApp(value);
  }, []);

  const handleDateApply = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleRowClick = useCallback((record) => ({
    onClick: () => {
      const params = new URLSearchParams({ id: record.id });
      if (record.projectId || projectId) params.set('project_id', record.projectId || projectId);
      window.location.href = `alert-management/bugsnag/issues/errorDetails?${params.toString()}`;
    },
  }), [projectId]);

  const handleAction = useCallback(({ key }, issue) => {
    const pid = issue.projectId || projectId;
    if (!pid) return;
    updateBugsnagErrorStatus({
      project_id: pid,
      error_id: issue.id,
      action: key,
      filters: { vulcanApp: selectedApp, fromDate: dateRange?.from, toDate: dateRange?.to },
    });
  }, [projectId, selectedApp, dateRange]);

  const appOptions = apps.map((a) => ({ value: a.name, label: a.display }));

  const columns = [
    {
      title: formatMessage(messages.columnDetails),
      dataIndex: 'errorClass',
      key: 'details',
      width: '45%',
      render: (_, record) => (
        <div>
          <div className="details-main">
            <strong>{record.errorClass}</strong>
            {record.context && (
              <span className="details-context"> &bull; {record.context}</span>
            )}
          </div>
          {record.message && (
            <div className="details-message">{record.message}</div>
          )}
        </div>
      ),
    },
    {
      title: formatMessage(messages.columnEvents),
      dataIndex: 'events',
      key: 'events',
      width: '10%',
      align: 'right',
      render: (val) => (val || 0).toLocaleString(),
    },
    {
      title: formatMessage(messages.columnUsers),
      dataIndex: 'users',
      key: 'users',
      width: '10%',
      align: 'right',
      render: (val) => (val || 0).toLocaleString(),
    },
    {
      title: formatMessage(messages.columnSeverity),
      dataIndex: 'severity',
      key: 'severity',
      width: '10%',
      render: (severity) => (
        <span className={`severity-badge severity-${severity}`}>
          {SEVERITY_DISPLAY[severity] || severity}
        </span>
      ),
    },
    {
      title: formatMessage(messages.columnLastSeen),
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: '20%',
      render: (val) => formatLastSeen(val),
    },
    {
      title: '',
      key: 'actions',
      width: '5%',
      render: (_, record) => {
        const menu = (
          <CapMenu onClick={(info) => handleAction(info, record)}>
            <MenuItem key="open">{formatMessage(messages.actionOpen)}</MenuItem>
            <MenuItem key="fixed">{formatMessage(messages.actionFixed)}</MenuItem>
            <MenuItem key="ignored">{formatMessage(messages.actionIgnored)}</MenuItem>
          </CapMenu>
        );
        return (
          <CapDropdown overlay={menu} trigger={['click']}>
            <CapButton
              className="action-btn"
              type="text"
              onClick={(e) => e.stopPropagation()}
            >
              &#8942;
            </CapButton>
          </CapDropdown>
        );
      },
    },
  ];

  return (
    <CapRow className={`${className} bugsnag-issue-listing`}>
      <CapColumn span={24}>
        <div className="toolbar-row">
          <div className="toolbar-field">
            <span className="toolbar-label">{formatMessage(messages.dateTimeRange)}</span>
            <DateAndTimePicker onApply={handleDateApply} />
          </div>
          <div className="toolbar-field">
            <span className="toolbar-label">{formatMessage(messages.application)}</span>
            <CapSelect
              className="app-select"
              options={appOptions}
              value={selectedApp}
              onChange={handleAppChange}
              loading={fetchingApps === REQUEST}
              style={{ width: '12rem' }}
            />
          </div>
        </div>

        <CapTable
          className="issue-table"
          columns={columns}
          dataSource={issues}
          loading={fetchingIssues === REQUEST}
          rowKey="id"
          onRow={handleRowClick}
          locale={{ emptyText: formatMessage(messages.noErrors) }}
        />
      </CapColumn>
    </CapRow>
  );
};

const mapStateToProps = createStructuredSelector({
  apps: makeSelectApps(),
  fetchingApps: makeSelectFetchingApps(),
  issues: makeSelectIssues(),
  projectId: makeSelectProjectId(),
  fetchingIssues: makeSelectFetchingIssues(),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getApplications: actions.getApplications,
      getBugsnagIssues: actions.getBugsnagIssues,
      updateBugsnagErrorStatus: actions.updateBugsnagErrorStatus,
    },
    dispatch,
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const ComposedBugsnagIssueListing = compose(
  injectReducer({ key: REDUCER_KEY, reducer }),
  injectSaga({ key: REDUCER_KEY, saga: sagas }),
  withConnect,
  injectIntl,
)(BugsnagIssueListing);

export default withStyles(ComposedBugsnagIssueListing, styles);
