import React, { useState, useCallback } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapRow,
  CapColumn,
  CapTable,
  CapSelect,
} from '@capillarytech/cap-ui-library';

import styles from './styles';
import messages from './messages';
import { VULCAN_APPS, DUMMY_ISSUES } from './constants';
import DateAndTimePicker from '../../molecules/DateAndTimePicker';

const SEVERITY_DISPLAY = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

const BugsnagIssueListing = ({ className, intl: { formatMessage } }) => {
  const [selectedApp, setSelectedApp] = useState('all');

  const handleAppChange = useCallback((value) => {
    setSelectedApp(value);
  }, []);

  const columns = [
    {
      title: formatMessage(messages.columnDetails),
      dataIndex: 'details',
      key: 'details',
      width: '40%',
      render: (text) => (
        <span className="details-cell" title={text}>{text}</span>
      ),
    },
    {
      title: formatMessage(messages.columnEvents),
      dataIndex: 'events',
      key: 'events',
      width: '12%',
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: formatMessage(messages.columnUsers),
      dataIndex: 'users',
      key: 'users',
      width: '12%',
      align: 'right',
      render: (val) => val.toLocaleString(),
    },
    {
      title: formatMessage(messages.columnSeverity),
      dataIndex: 'severity',
      key: 'severity',
      width: '12%',
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
      width: '18%',
    },
  ];

  return (
    <CapRow className={`${className} bugsnag-issue-listing`}>
      <CapColumn span={24}>
        <div className="toolbar-row">
          <DateAndTimePicker />
          <CapSelect
            className="app-select"
            options={VULCAN_APPS}
            value={selectedApp}
            onChange={handleAppChange}
            style={{ width: '12rem' }}
          />
        </div>

        <CapTable
          className="issue-table"
          columns={columns}
          dataSource={DUMMY_ISSUES}
        />
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(BugsnagIssueListing, styles));
