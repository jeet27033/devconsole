import React, { useState, useCallback, useRef, useEffect } from "react";
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  CapRow,
  CapColumn,
  CapTable,
  CapInput,
  CapSelect,
  CapButton,
} from "@capillarytech/cap-ui-library";
import CapSpin from "@capillarytech/cap-ui-library/CapSpin";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import styles from "./styles";
import messages from "./messages";
import { injectSaga, injectReducer, withStyles } from "@capillarytech/vulcan-react-sdk/utils";
import { STATUS_OPTIONS, DEBOUNCE_MS, REDUCER_KEY } from "./constants";
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import {
  makeSelectAuditLogs,
  makeSelectFetchingAuditLogs,
  makeSelectAuditLogsError,
  makeSelectAuditLogDetail,
  makeSelectFetchingAuditLogDetail,
  makeSelectAuditLogDetailError,
  makeSelectApprovingAuditLog,
  makeSelectRejectingAuditLog,
} from './selectors';
import { REQUEST, SUCCESS } from '../../pages/App/constants';
import CustomModal from '../../molecules/CustomModal';

const STATUS_DISPLAY = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  PENDING_APPROVAL: 'Pending Approval',
  REJECTED: 'Rejected',
};

const mapRow = (row, idx) => ({
  key: String(row.id || idx),
  id: row.id,
  query: row.query,
  createdBy: row.created_by,
  createdOn: row.created_at,
  status: row.status,
  executionTime: row.query_execution_time,
  database: row.mongo_database,
  collection: row.collection,
  noOfRecords: row.no_of_records,
});

const detailStyles = {
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#f5f5f5',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  idLabel: { fontSize: '11px', color: '#8c8c8c', marginBottom: '2px' },
  idValue: { fontSize: '16px', fontWeight: 700, color: '#262626' },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#8c8c8c',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '16px 0 8px',
    paddingBottom: '4px',
    borderBottom: '1px solid #e8e8e8',
  },
  queryBlock: {
    background: '#1a1a2e',
    color: '#e2e8f0',
    padding: '12px 16px',
    borderRadius: '6px',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '13px',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    maxHeight: '160px',
    overflowY: 'auto',
    border: '1px solid #2d3748',
    marginBottom: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px 24px',
    marginBottom: '4px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '3px' },
  label: { fontSize: '11px', fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.05em' },
  value: { fontSize: '13px', color: '#262626', fontWeight: 500, wordBreak: 'break-word' },
  actionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #e8e8e8',
  },
};

const DetailField = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div style={detailStyles.field}>
      <span style={detailStyles.label}>{label}</span>
      <span style={detailStyles.value}>{value}</span>
    </div>
  );
};

const DBAuditLog = ({
  className,
  intl: { formatMessage },
  auditLogs,
  fetchingAuditLogs,
  auditLogDetail,
  fetchingAuditLogDetail,
  approvingAuditLog,
  rejectingAuditLog,
  actions: boundActions,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState({});
  const [detailVisible, setDetailVisible] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    boundActions.getMongoAuditLogs(appliedFilters);
  }, [appliedFilters]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedFilters((prev) => ({ ...prev, search: value || undefined }));
    }, DEBOUNCE_MS);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setSelectedStatus(value);
    setAppliedFilters((prev) => ({ ...prev, status: value === 'all' ? undefined : value }));
  }, []);

  const handleRefresh = useCallback(() => {
    boundActions.getMongoAuditLogs(appliedFilters);
  }, [appliedFilters, boundActions]);

  const handleRowClick = useCallback((record) => {
    setDetailVisible(true);
    boundActions.getMongoAuditLogDetail(record.id);
  }, [boundActions]);

  const handleDetailClose = useCallback(() => {
    setDetailVisible(false);
    boundActions.clearMongoAuditLogDetail();
  }, [boundActions]);

  const handleApprove = useCallback(() => {
    if (!auditLogDetail?.id) return;
    boundActions.approveMongoAuditLog(auditLogDetail.id);
  }, [auditLogDetail, boundActions]);

  const handleReject = useCallback(() => {
    if (!auditLogDetail?.id) return;
    boundActions.rejectMongoAuditLog(auditLogDetail.id);
  }, [auditLogDetail, boundActions]);

  const tableData = (auditLogs || []).map(mapRow);

  const columns = [
    {
      title: formatMessage(messages.columnId),
      dataIndex: 'id',
      key: 'id',
      width: '6%',
    },
    {
      title: formatMessage(messages.columnQuery),
      dataIndex: 'query',
      key: 'query',
      width: '30%',
      render: (text) => <span className="query-cell" title={text}>{text}</span>,
    },
    {
      title: formatMessage(messages.columnCreatedBy),
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: '16%',
    },
    {
      title: formatMessage(messages.columnCreatedOn),
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: '16%',
    },
    {
      title: formatMessage(messages.columnStatus),
      dataIndex: 'status',
      key: 'status',
      width: '14%',
      render: (status) => (
        <span className={`status-badge status-${(status || '').toLowerCase()}`}>
          {STATUS_DISPLAY[status] || status}
        </span>
      ),
    },
    {
      title: formatMessage(messages.columnExecutionTime),
      dataIndex: 'executionTime',
      key: 'executionTime',
      width: '14%',
      align: 'right',
      render: (time) => (time !== null && time !== undefined ? `${time} ms` : '—'),
    },
  ];

  const isLoadingDetail = fetchingAuditLogDetail === REQUEST;
  const isApproving = approvingAuditLog === REQUEST;
  const isRejecting = rejectingAuditLog === REQUEST;

  // Refresh list after approve/reject completes
  useEffect(() => {
    if (approvingAuditLog === SUCCESS || rejectingAuditLog === SUCCESS) {
      boundActions.getMongoAuditLogs(appliedFilters);
    }
  }, [approvingAuditLog, rejectingAuditLog]);

  return (
    <CapRow className={`${className} db-audit-log`}>
      <CapColumn span={24}>
        <CapRow className="filter-bar" type="flex" align="middle">
          <CapColumn>
            <CapInput
              className="search-input"
              placeholder={formatMessage(messages.searchPlaceholder)}
              value={inputValue}
              onChange={handleSearchChange}
            />
          </CapColumn>
          <CapColumn>
            <CapSelect
              className="status-filter"
              placeholder={formatMessage(messages.filterByStatus)}
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ width: '14rem' }}
            />
          </CapColumn>
          <CapColumn>
            <CapButton type="secondary" onClick={handleRefresh} loading={fetchingAuditLogs === REQUEST}>
              Refresh
            </CapButton>
          </CapColumn>
        </CapRow>

        <CapTable
          className="audit-table"
          columns={columns}
          dataSource={tableData}
          loading={fetchingAuditLogs === REQUEST}
          onRow={(record) => ({ onClick: () => handleRowClick(record) })}
        />
      </CapColumn>

      <CustomModal
        visible={detailVisible}
        onCancel={handleDetailClose}
        title="Query Detail"
        footer={null}
        width={640}
      >
        {isLoadingDetail ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CapSpin />
          </div>
        ) : auditLogDetail ? (
          <div>
            <div style={detailStyles.statusRow}>
              <div>
                <div style={detailStyles.idLabel}>ID</div>
                <div style={detailStyles.idValue}>#{auditLogDetail.id}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className={`status-badge status-${(auditLogDetail.status || '').toLowerCase()}`}>
                  {STATUS_DISPLAY[auditLogDetail.status] || auditLogDetail.status}
                </span>
              </div>
            </div>

            <div style={detailStyles.sectionTitle}>Query</div>
            <pre style={detailStyles.queryBlock}>{auditLogDetail.query}</pre>

            <div style={detailStyles.sectionTitle}>Context</div>
            <div style={detailStyles.grid}>
              <DetailField label="Database" value={auditLogDetail.mongo_database} />
              <DetailField label="Collection" value={auditLogDetail.collection} />
            </div>

            <div style={detailStyles.sectionTitle}>Execution</div>
            <div style={detailStyles.grid}>
              <DetailField label="Created By" value={auditLogDetail.created_by} />
              <DetailField label="Created On" value={auditLogDetail.created_at} />
              <DetailField
                label="Execution Time"
                value={auditLogDetail.query_execution_time != null ? `${auditLogDetail.query_execution_time} ms` : null}
              />
              <DetailField label="No. of Records" value={auditLogDetail.no_of_records} />
            </div>

            {(auditLogDetail.approved_by || auditLogDetail.updated_at || auditLogDetail.hotswap_id) && (
              <>
                <div style={detailStyles.sectionTitle}>Approval</div>
                <div style={detailStyles.grid}>
                  <DetailField label="Approved By" value={auditLogDetail.approved_by} />
                  <DetailField label="Updated At" value={auditLogDetail.updated_at} />
                  <DetailField label="Hotswap ID" value={auditLogDetail.hotswap_id} />
                </div>
              </>
            )}

            {auditLogDetail.status === 'PENDING_APPROVAL' && (
              <div style={detailStyles.actionRow}>
                <CapButton
                  type="primary"
                  onClick={handleApprove}
                  loading={isApproving}
                  disabled={isApproving || isRejecting}
                >
                  Approve
                </CapButton>
                <CapButton
                  type="secondary"
                  onClick={handleReject}
                  loading={isRejecting}
                  disabled={isApproving || isRejecting}
                  style={{ color: '#cf1322', borderColor: '#cf1322' }}
                >
                  Reject
                </CapButton>
              </div>
            )}
          </div>
        ) : null}
      </CustomModal>
    </CapRow>
  );
};

const mapStateToProps = createStructuredSelector({
  auditLogs: makeSelectAuditLogs(),
  fetchingAuditLogs: makeSelectFetchingAuditLogs(),
  auditLogsError: makeSelectAuditLogsError(),
  auditLogDetail: makeSelectAuditLogDetail(),
  fetchingAuditLogDetail: makeSelectFetchingAuditLogDetail(),
  auditLogDetailError: makeSelectAuditLogDetailError(),
  approvingAuditLog: makeSelectApprovingAuditLog(),
  rejectingAuditLog: makeSelectRejectingAuditLog(),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = sagas.map((saga, index) =>
  injectSaga({ key: `${REDUCER_KEY}-${index}`, saga }),
);

const withReducer = injectReducer({ key: REDUCER_KEY, reducer });

export default withRouter(compose(
  ...withSaga,
  withReducer,
  withConnect,
)(injectIntl(withStyles(DBAuditLog, styles))));
