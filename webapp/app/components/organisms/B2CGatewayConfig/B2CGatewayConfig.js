import React, { useState, useCallback, useMemo } from 'react';
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
import CapModal from '@capillarytech/cap-ui-library/CapModal';
import CapTooltipWithInfo from '@capillarytech/cap-ui-library/CapTooltipWithInfo';

import styles from './styles';
import messages from './messages';
import {
  KEY_TABLE_COLUMNS,
  WHITELISTED_API_COLUMNS,
  ACCESS_TYPES,
  REQUEST_TYPES,
  MIGRATION_REQUEST_COLUMNS,
  API_REQUEST_COLUMNS,
  CONFLUENCE_DOC_URL,
} from './constants';

const DataTable = ({ columns, data, emptyMessage }) => (
  <div className="table-container">
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.dataIndex} style={{ width: col.width }}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>
              <div className="empty-state">{emptyMessage}</div>
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((col) => (
                <td key={col.dataIndex}>{row[col.dataIndex] ?? ''}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const B2CGatewayConfig = ({ className, intl: { formatMessage } }) => {
  // Key-Secret state
  const [keys, setKeys] = useState([
    { id: 1, clientKey: 'ck_prod_8a7b6c5d4e3f2g1h', clientSecret: 'cs_prod_1h2g3f4e5d6c7b8a', accessType: 'Write', status: 'Active' },
    { id: 2, clientKey: 'ck_prod_z9y8x7w6v5u4t3s2', clientSecret: 'cs_prod_2s3t4u5v6w7x8y9z', accessType: 'Recognized', status: 'Active' },
    { id: 3, clientKey: 'ck_stg_m1n2o3p4q5r6s7t8', clientSecret: 'cs_stg_8t7s6r5q4p3o2n1m', accessType: 'Write', status: 'Inactive' },
  ]);
  const [keySearch, setKeySearch] = useState('');
  const [addKeyModalVisible, setAddKeyModalVisible] = useState(false);
  const [migrationRequestsVisible, setMigrationRequestsVisible] = useState(false);
  const [migrationRequests, setMigrationRequests] = useState([
    { id: 201, clientKey: 'ck_prod_new_abc123', clientSecret: 'cs_prod_new_xyz789', accessType: 'Write', submittedBy: 'jeet.patel', approvedBy: 'admin.ops', status: 'Approved' },
    { id: 202, clientKey: 'ck_prod_test_def456', clientSecret: 'cs_prod_test_uvw321', accessType: 'Recognized', submittedBy: 'dev.user', approvedBy: '-', status: 'Pending Approval' },
  ]);
  const [newKey, setNewKey] = useState({
    clientKey: '',
    clientSecret: '',
    accessType: '',
  });
  const [alreadyComplete, setAlreadyComplete] = useState(false);

  // Whitelisted APIs state
  const [apis, setApis] = useState([
    { id: 1, relativeUrl: '/v2/api/v1/xto6x/execute/oauthjwt', requestType: 'POST' },
    { id: 2, relativeUrl: '/v2/api/v1/xto6x/execute/memberLookup', requestType: 'GET' },
    { id: 3, relativeUrl: '/v2/api/v1/xto6x/execute/pointsAccrual', requestType: 'POST' },
    { id: 4, relativeUrl: '/v2/api/v1/xto6x/execute/couponRedeem', requestType: 'POST' },
    { id: 5, relativeUrl: '/v2/api/v1/xto6x/execute/transactionAdd', requestType: 'PUT' },
  ]);
  const [apiSearch, setApiSearch] = useState('');
  const [addApiModalVisible, setAddApiModalVisible] = useState(false);
  const [apiRequestsVisible, setApiRequestsVisible] = useState(false);
  const [apiRequests, setApiRequests] = useState([
    { id: 301, relativeUrl: '/v2/api/v1/xto6x/execute/newEndpoint', requestType: 'GET', submittedBy: 'jeet.patel', approvedBy: 'admin.ops', status: 'Approved' },
    { id: 302, relativeUrl: '/v2/api/v1/xto6x/execute/batchProcess', requestType: 'POST', submittedBy: 'dev.user', approvedBy: '-', status: 'Pending Approval' },
    { id: 303, relativeUrl: '/v2/api/v1/xto6x/execute/reportGenerate', requestType: 'POST', submittedBy: 'admin.user', approvedBy: 'jeet.patel', status: 'Rejected' },
  ]);
  const [newApi, setNewApi] = useState({
    apiEndpointSuffix: '',
    requestType: '',
  });

  const filteredKeys = useMemo(() => {
    if (!keySearch) return keys;
    const q = keySearch.toLowerCase();
    return keys.filter((k) => k.clientKey.toLowerCase().includes(q));
  }, [keys, keySearch]);

  const filteredApis = useMemo(() => {
    if (!apiSearch) return apis;
    const q = apiSearch.toLowerCase();
    return apis.filter((a) => a.relativeUrl.toLowerCase().includes(q));
  }, [apis, apiSearch]);

  const handleAddKey = useCallback(() => {
    // API call placeholder
    setAddKeyModalVisible(false);
    setNewKey({ clientKey: '', clientSecret: '', accessType: '' });
  }, [newKey]);

  const handleAddApi = useCallback(() => {
    // API call placeholder
    setAddApiModalVisible(false);
    setNewApi({ apiEndpointSuffix: '', requestType: '' });
  }, [newApi]);

  const handleOpenMigrationRequests = useCallback(() => {
    // API call placeholder
    setMigrationRequestsVisible(true);
  }, []);

  const handleOpenApiRequests = useCallback(() => {
    // API call placeholder
    setApiRequestsVisible(true);
  }, []);

  return (
    <CapRow className={`${className} b2c-gateway-config`}>
      <CapColumn span={24}>
        {/* Client Key-Secret Management */}
        <div className="section">
          <CapHeading type="h3" className="section-title">
            {formatMessage(messages.clientKeySecretManagement)}
          </CapHeading>
          <div className="toolbar-row">
            <CapInput
              value={keySearch}
              placeholder={formatMessage(messages.searchByClientKey)}
              onChange={(e) => setKeySearch(e.target.value)}
              style={{ width: '16rem' }}
            />
            <div className="toolbar-actions">
              <CapButton
                type="primary"
                onClick={() => setAddKeyModalVisible(true)}
                disabled={alreadyComplete}
              >
                {formatMessage(messages.addClientKeySecret)}
              </CapButton>
              <CapButton
                type="secondary"
                onClick={handleOpenMigrationRequests}
              >
                {formatMessage(messages.migrationRequests)}
              </CapButton>
            </div>
          </div>

          {alreadyComplete && (
            <div className="info-banner">
              {formatMessage(messages.alreadyComplete)}
            </div>
          )}

          <DataTable
            columns={KEY_TABLE_COLUMNS}
            data={filteredKeys}
            emptyMessage={formatMessage(messages.noKeys)}
          />
        </div>

        {/* Whitelisted APIs */}
        <div className="section section-divider">
          <CapHeading type="h3" className="section-title">
            {formatMessage(messages.whitelistedApis)}
          </CapHeading>
          <div className="toolbar-row">
            <CapInput
              value={apiSearch}
              placeholder={formatMessage(messages.searchByApiEndpoint)}
              onChange={(e) => setApiSearch(e.target.value)}
              style={{ width: '16rem' }}
            />
            <div className="toolbar-actions">
              <CapButton
                type="primary"
                onClick={() => setAddApiModalVisible(true)}
              >
                {formatMessage(messages.addWhitelistedApi)}
              </CapButton>
              <CapButton type="secondary" onClick={handleOpenApiRequests}>
                {formatMessage(messages.apiRequests)}
              </CapButton>
            </div>
          </div>

          <DataTable
            columns={WHITELISTED_API_COLUMNS}
            data={filteredApis}
            emptyMessage={formatMessage(messages.noApis)}
          />
        </div>

        {/* Documentation Footer */}
        <div className="doc-footer">
          {formatMessage(messages.documentationLink).split('B2C Gateway Config Confluence Documentation')[0]}
          <a
            href={CONFLUENCE_DOC_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            B2C Gateway Config Confluence Documentation
          </a>
          {formatMessage(messages.documentationLink).split('B2C Gateway Config Confluence Documentation')[1]}
        </div>

        {/* Add Key-Secret Modal */}
        <CapModal
          title={formatMessage(messages.addClientKeySecret)}
          visible={addKeyModalVisible}
          onOk={handleAddKey}
          onCancel={() => {
            setAddKeyModalVisible(false);
            setNewKey({ clientKey: '', clientSecret: '', accessType: '' });
          }}
          okText={formatMessage(messages.submit)}
          cancelText={formatMessage(messages.cancel)}
        >
          <div className="modal-form">
            <div className="modal-form-field">
              <label>{formatMessage(messages.clientKey)}</label>
              <CapInput
                value={newKey.clientKey}
                onChange={(e) =>
                  setNewKey((p) => ({ ...p, clientKey: e.target.value }))
                }
              />
            </div>
            <div className="modal-form-field">
              <label>{formatMessage(messages.clientSecret)}</label>
              <CapInput
                value={newKey.clientSecret}
                onChange={(e) =>
                  setNewKey((p) => ({ ...p, clientSecret: e.target.value }))
                }
              />
            </div>
            <div className="modal-form-field">
              <label>{formatMessage(messages.accessType)}</label>
              <CapSelect
                options={ACCESS_TYPES}
                value={newKey.accessType}
                onChange={(val) =>
                  setNewKey((p) => ({ ...p, accessType: val }))
                }
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </CapModal>

        {/* Add Whitelisted API Modal */}
        <CapModal
          title={formatMessage(messages.addWhitelistedApi)}
          visible={addApiModalVisible}
          onOk={handleAddApi}
          onCancel={() => {
            setAddApiModalVisible(false);
            setNewApi({ apiEndpointSuffix: '', requestType: '' });
          }}
          okText={formatMessage(messages.submit)}
          cancelText={formatMessage(messages.cancel)}
        >
          <div className="modal-form">
            <div className="modal-form-field">
              <label>
                {formatMessage(messages.requestUri)}
                <CapTooltipWithInfo
                  title={formatMessage(messages.requestUriHelp)}
                />
              </label>
              <CapInput
                value={newApi.apiEndpointSuffix}
                placeholder="e.g. oauthjwttest"
                onChange={(e) =>
                  setNewApi((p) => ({
                    ...p,
                    apiEndpointSuffix: e.target.value,
                  }))
                }
              />
            </div>
            <div className="modal-form-field">
              <label>{formatMessage(messages.requestType)}</label>
              <CapSelect
                options={REQUEST_TYPES}
                value={newApi.requestType}
                onChange={(val) =>
                  setNewApi((p) => ({ ...p, requestType: val }))
                }
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </CapModal>

        {/* Migration Requests Modal */}
        <CapModal
          title={formatMessage(messages.migrationRequests)}
          visible={migrationRequestsVisible}
          onCancel={() => setMigrationRequestsVisible(false)}
          footer={null}
          width={900}
        >
          <div className="requests-table-container">
            <DataTable
              columns={MIGRATION_REQUEST_COLUMNS}
              data={migrationRequests}
              emptyMessage="No migration requests found."
            />
          </div>
        </CapModal>

        {/* API Requests Modal */}
        <CapModal
          title={formatMessage(messages.apiRequests)}
          visible={apiRequestsVisible}
          onCancel={() => setApiRequestsVisible(false)}
          footer={null}
          width={900}
        >
          <div className="requests-table-container">
            <DataTable
              columns={API_REQUEST_COLUMNS}
              data={apiRequests}
              emptyMessage="No API requests found."
            />
          </div>
        </CapModal>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(B2CGatewayConfig, styles));
