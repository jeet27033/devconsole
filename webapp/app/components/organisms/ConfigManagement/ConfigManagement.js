import React, { useState, useCallback, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import {
  CapRow,
  CapColumn,
  CapInput,
  CapButton,
  CapHeading,
} from '@capillarytech/cap-ui-library';
import CapModal from '@capillarytech/cap-ui-library/CapModal';

import styles from './styles';
import messages from './messages';
import { CONFIG_TABLE_COLUMNS, REQUEST_TABLE_COLUMNS } from './constants';

const ConfigManagement = ({ className, intl: { formatMessage } }) => {
  const [configs, setConfigs] = useState([
    { id: 1, configName: 'MAX_RETRY_COUNT', configValue: '3', isSecret: false },
    { id: 2, configName: 'API_TIMEOUT_MS', configValue: '30000', isSecret: false },
    { id: 3, configName: 'CACHE_TTL_SECONDS', configValue: '300', isSecret: false },
    { id: 4, configName: 'REDIS_PASSWORD', configValue: 'r3d!s$ecr3t', isSecret: true },
    { id: 5, configName: 'FEATURE_FLAG_NEW_UI', configValue: 'true', isSecret: false },
    { id: 6, configName: 'DB_CONNECTION_POOL_SIZE', configValue: '25', isSecret: false },
    { id: 7, configName: 'JWT_SECRET_KEY', configValue: 'jwt-super-secret-key-2026', isSecret: true },
    { id: 8, configName: 'RATE_LIMIT_PER_MINUTE', configValue: '1000', isSecret: false },
    { id: 9, configName: 'WEBHOOK_SIGNING_SECRET', configValue: 'whsec_abc123def456', isSecret: true },
    { id: 10, configName: 'LOG_LEVEL', configValue: 'INFO', isSecret: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [overwriteModalVisible, setOverwriteModalVisible] = useState(false);
  const [requestsModalVisible, setRequestsModalVisible] = useState(false);
  const [configRequests, setConfigRequests] = useState([
    { id: 101, configName: 'NEW_FEATURE_ENABLED', configValue: 'true', isSecret: false, submittedBy: 'jeet.patel', status: 'Pending Approval' },
    { id: 102, configName: 'API_KEY_PARTNER_X', configValue: 'pk_live_abc123', isSecret: true, submittedBy: 'dev.ops', status: 'Approved' },
    { id: 103, configName: 'MAX_BATCH_SIZE', configValue: '500', isSecret: false, submittedBy: 'jeet.patel', status: 'Pending Approval' },
    { id: 104, configName: 'CACHE_TTL_SECONDS', configValue: '600', isSecret: false, submittedBy: 'admin.user', status: 'Rejected' },
  ]);
  const [newConfig, setNewConfig] = useState({
    configName: '',
    configValue: '',
    isSecret: false,
  });

  const filteredConfigs = useMemo(() => {
    if (!searchQuery) return configs;
    const q = searchQuery.toLowerCase();
    return configs.filter((c) => c.configName.toLowerCase().includes(q));
  }, [configs, searchQuery]);

  const handleAddConfig = useCallback(() => {
    const existing = configs.find(
      (c) => c.configName === newConfig.configName,
    );
    if (existing) {
      setOverwriteModalVisible(true);
      return;
    }
    // API call placeholder
    setAddModalVisible(false);
    setNewConfig({ configName: '', configValue: '', isSecret: false });
  }, [configs, newConfig]);

  const handleConfirmOverwrite = useCallback(() => {
    // API call placeholder
    setOverwriteModalVisible(false);
    setAddModalVisible(false);
    setNewConfig({ configName: '', configValue: '', isSecret: false });
  }, [newConfig]);

  const handleOpenRequests = useCallback(() => {
    // API call placeholder: fetch config requests
    setRequestsModalVisible(true);
  }, []);

  return (
    <CapRow className={`${className} config-management`}>
      <CapColumn span={24}>
        <div className="toolbar-row">
          <CapInput
            value={searchQuery}
            placeholder={formatMessage(messages.searchByConfigName)}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '16rem' }}
          />
          <div className="toolbar-actions">
            <CapButton
              type="primary"
              onClick={() => setAddModalVisible(true)}
            >
              {formatMessage(messages.addConfig)}
            </CapButton>
            <CapButton type="secondary" onClick={handleOpenRequests}>
              {formatMessage(messages.configRequests)}
            </CapButton>
          </div>
        </div>

        <div className="config-table-container">
          <table className="config-table">
            <thead>
              <tr>
                {CONFIG_TABLE_COLUMNS.map((col) => (
                  <th key={col.dataIndex} style={{ width: col.width }}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.length === 0 ? (
                <tr>
                  <td colSpan={CONFIG_TABLE_COLUMNS.length}>
                    <div className="empty-state">
                      {formatMessage(messages.noConfigs)}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConfigs.map((config) => (
                  <tr key={config.id}>
                    <td>{config.id}</td>
                    <td>{config.configName}</td>
                    <td>{config.isSecret ? '••••••' : config.configValue}</td>
                    <td>{config.isSecret ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Config Modal */}
        <CapModal
          title={formatMessage(messages.addConfig)}
          visible={addModalVisible}
          onOk={handleAddConfig}
          onCancel={() => {
            setAddModalVisible(false);
            setNewConfig({ configName: '', configValue: '', isSecret: false });
          }}
          okText={formatMessage(messages.submit)}
          cancelText={formatMessage(messages.cancel)}
        >
          <div className="modal-form">
            <div className="modal-form-field">
              <label>{formatMessage(messages.configName)}</label>
              <CapInput
                value={newConfig.configName}
                onChange={(e) =>
                  setNewConfig((p) => ({ ...p, configName: e.target.value }))
                }
              />
            </div>
            <div className="modal-form-field">
              <label>{formatMessage(messages.configValue)}</label>
              <CapInput
                value={newConfig.configValue}
                onChange={(e) =>
                  setNewConfig((p) => ({ ...p, configValue: e.target.value }))
                }
              />
            </div>
            <div className="switch-field">
              <input
                type="checkbox"
                id="isSecret"
                checked={newConfig.isSecret}
                onChange={(e) =>
                  setNewConfig((p) => ({ ...p, isSecret: e.target.checked }))
                }
              />
              <label htmlFor="isSecret">
                {formatMessage(messages.isSecret)}
              </label>
            </div>
          </div>
        </CapModal>

        {/* Overwrite Confirm Modal */}
        <CapModal
          title={formatMessage(messages.overwriteTitle)}
          visible={overwriteModalVisible}
          onOk={handleConfirmOverwrite}
          onCancel={() => setOverwriteModalVisible(false)}
          okText={formatMessage(messages.confirm)}
          cancelText={formatMessage(messages.cancel)}
        >
          <p>
            {formatMessage(messages.overwriteMessage, {
              configName: newConfig.configName,
            })}
          </p>
        </CapModal>

        {/* Config Requests Modal */}
        <CapModal
          title={formatMessage(messages.configRequests)}
          visible={requestsModalVisible}
          onCancel={() => setRequestsModalVisible(false)}
          footer={null}
          width={800}
        >
          <div className="requests-warning">
            {formatMessage(messages.secretsWarning)}
          </div>
          <div className="requests-table-container">
            <table className="config-table">
              <thead>
                <tr>
                  {REQUEST_TABLE_COLUMNS.map((col) => (
                    <th key={col.dataIndex} style={{ width: col.width }}>
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {configRequests.length === 0 ? (
                  <tr>
                    <td colSpan={REQUEST_TABLE_COLUMNS.length}>
                      <div className="empty-state">No requests found.</div>
                    </td>
                  </tr>
                ) : (
                  configRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.configName}</td>
                      <td>{req.isSecret ? '••••••' : req.configValue}</td>
                      <td>{req.isSecret ? 'Yes' : 'No'}</td>
                      <td>{req.submittedBy}</td>
                      <td>{req.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CapModal>
      </CapColumn>
    </CapRow>
  );
};

export default injectIntl(withStyles(ConfigManagement, styles));
