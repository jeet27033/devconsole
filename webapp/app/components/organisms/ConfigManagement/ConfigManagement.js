import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  CapButton,
  CapCheckbox,
} from '@capillarytech/cap-ui-library';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';
import CapNotification from '@capillarytech/cap-ui-library/CapNotification';
import CustomModal from '../../molecules/CustomModal';
import { getAuthenticationDetails } from '../../../utils/authWrapper';

import styles from './styles';
import messages from './messages';
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import {
  CONFIG_TABLE_COLUMNS,
  REQUEST_TABLE_COLUMNS,
  REDUCER_KEY,
  CONFIG_STATUS,
} from './constants';
import {
  makeSelectConfigs,
  makeSelectFetchingConfigs,
  makeSelectConfigRequests,
  makeSelectFetchingConfigRequests,
  makeSelectSavingConfig,
} from './selectors';
import { REQUEST, SUCCESS } from '../../pages/App/constants';

const ConfigManagement = ({
  className,
  intl: { formatMessage },
  configs,
  fetchingConfigs,
  configRequests,
  fetchingConfigRequests,
  savingConfig,
  actions: boundActions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [overwriteModalVisible, setOverwriteModalVisible] = useState(false);
  const [requestsModalVisible, setRequestsModalVisible] = useState(false);
  const [newConfig, setNewConfig] = useState({
    configName: '',
    configValue: '',
    isSecret: false,
  });

  useEffect(() => {
    boundActions.getConfigs({ status: CONFIG_STATUS.SUCCESS });
  }, [boundActions]);

  useEffect(() => {
    if (savingConfig === SUCCESS) {
      setAddModalVisible(false);
      setOverwriteModalVisible(false);
      setNewConfig({ configName: '', configValue: '', isSecret: false });
      boundActions.resetSaveConfig();
    }
  }, [savingConfig, boundActions]);

  const filteredConfigs = useMemo(() => {
    if (!searchQuery) return configs;
    const q = searchQuery.toLowerCase();
    return (configs || []).filter((c) =>
      (c.configName || '').toLowerCase().includes(q),
    );
  }, [configs, searchQuery]);

  const searchDebounceRef = useRef(null);
  const handleRequestSearch = useCallback((e) => {
    const value = e.target.value;
    setRequestSearchQuery(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      boundActions.getConfigRequests({ status: CONFIG_STATUS.PENDING_APPROVAL, configName: value });
    }, 400);
  }, [boundActions]);

  const dispatchSave = useCallback(() => {
    const { user } = getAuthenticationDetails();
    console.log('User in config management', user);
    boundActions.saveConfig({
      payload: {
        configName: newConfig.configName,
        configValue: newConfig.configValue,
        isSecret: newConfig.isSecret,
      },
      userMail: user?.attributes?.USERNAME?.value?.split('@')[0] || '',
      status: CONFIG_STATUS.PENDING_APPROVAL,
      action: 'insert',
      configId: null,
    });
  }, [newConfig, boundActions]);

  const handleAddConfig = useCallback(() => {
    if (!newConfig.configName || !newConfig.configValue) return;
    const existing = (configs || []).find(
      (c) => c.configName === newConfig.configName,
    );
    if (existing) {
      setOverwriteModalVisible(true);
      return;
    }
    dispatchSave();
  }, [configs, newConfig, dispatchSave]);

  const handleConfirmOverwrite = useCallback(() => {
    dispatchSave();
  }, [dispatchSave]);

  const handleOpenRequests = useCallback(() => {
    boundActions.getConfigRequests({ status: CONFIG_STATUS.PENDING_APPROVAL });
    setRequestSearchQuery('');
    setRequestsModalVisible(true);
  }, [boundActions]);

  const handleApprove = useCallback((req) => {
    const { user } = getAuthenticationDetails();
    const currentUser = user?.attributes?.USERNAME?.value?.split('@')[0] || '';
    if (currentUser && req.user && currentUser === req.user) {
      CapNotification.error({
        message: 'Self-approval not allowed',
        description: 'You cannot approve a config request that you submitted.',
        duration: 4,
      });
      return;
    }
    boundActions.saveConfig({
      action: 'approve',
      configId: req.id,
      payload: null,
      userMail: '',
      status: CONFIG_STATUS.SUCCESS,
    });
  }, [boundActions]);

  const handleReject = useCallback((req) => {
    boundActions.saveConfig({
      action: 'reject',
      configId: req.id,
      payload: null,
      userMail: '',
      status: CONFIG_STATUS.REJECTED,
    });
  }, [boundActions]);

  const isLoadingConfigs = fetchingConfigs === REQUEST;
  const isLoadingRequests = fetchingConfigRequests === REQUEST;
  const isSaving = savingConfig === REQUEST;

  const tdStyle = { padding: '8px 12px', fontSize: 13, color: '#262626', borderBottom: '1px solid #e8e8e8', verticalAlign: 'middle' };
  const truncStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 0 };
  const statusColors = {
    PENDING_APPROVAL: { background: '#fff7e6', color: '#d46b08' },
    SUCCESS: { background: '#f6ffed', color: '#389e0d' },
    REJECTED: { background: '#fff1f0', color: '#cf1322' },
  };
  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    ...(statusColors[status] || { background: '#f0f0f0', color: '#595959' }),
  });
  const isAddFormValid =
    Boolean(newConfig.configName.trim()) &&
    Boolean(newConfig.configValue.trim());

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
            <CapButton type="primary" onClick={() => setAddModalVisible(true)}>
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
              {isLoadingConfigs ? (
                <tr>
                  <td colSpan={CONFIG_TABLE_COLUMNS.length}>
                    <div className="empty-state">
                      <CapSpin />
                    </div>
                  </td>
                </tr>
              ) : filteredConfigs.length === 0 ? (
                <tr>
                  <td colSpan={CONFIG_TABLE_COLUMNS.length}>
                    <div className="empty-state">
                      {formatMessage(messages.noConfigs)}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConfigs.map((config, idx) => (
                  <tr key={config.id ?? `${config.configName}-${idx}`}>
                    <td>{config.id ?? idx + 1}</td>
                    <td>{config.configName}</td>
                    <td>{config.isSecret ? '••••••' : config.configValue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Config Modal */}
        <CustomModal
          title={formatMessage(messages.addConfig)}
          visible={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false);
            setNewConfig({ configName: '', configValue: '', isSecret: false });
          }}
          footer={[
            <CapButton
              key="cancel"
              type="secondary"
              onClick={() => {
                setAddModalVisible(false);
                setNewConfig({
                  configName: '',
                  configValue: '',
                  isSecret: false,
                });
              }}
            >
              {formatMessage(messages.cancel)}
            </CapButton>,
            <CapButton
              key="submit"
              type="primary"
              onClick={handleAddConfig}
              loading={isSaving}
              disabled={!isAddFormValid}
            >
              {formatMessage(messages.submit)}
            </CapButton>,
          ]}
        >
          <div className="modal-form">
            <div className="modal-form-field" style={{ 'margin-bottom': '4%' }}>
              <label>{formatMessage(messages.configName)}</label>
              <CapInput
                value={newConfig.configName}
                onChange={(e) =>
                  setNewConfig((p) => ({ ...p, configName: e.target.value }))
                }
              />
            </div>
            <div className="modal-form-field" style={{ 'margin-bottom': '4%' }}>
              <label>{formatMessage(messages.configValue)}</label>
              <CapInput
                value={newConfig.configValue}
                onChange={(e) =>
                  setNewConfig((p) => ({ ...p, configValue: e.target.value }))
                }
              />
            </div>
            <div className="modal-form-field">
              <CapCheckbox
                checked={newConfig.isSecret}
                onChange={(e) =>
                  setNewConfig((p) => ({ ...p, isSecret: e.target.checked }))
                }
              >
                {formatMessage(messages.isSecret)}
              </CapCheckbox>
            </div>
          </div>
        </CustomModal>

        {/* Overwrite Confirm Modal */}
        <CustomModal
          title={formatMessage(messages.overwriteTitle)}
          visible={overwriteModalVisible}
          onCancel={() => setOverwriteModalVisible(false)}
          footer={[
            <CapButton
              key="cancel"
              type="secondary"
              onClick={() => setOverwriteModalVisible(false)}
            >
              {formatMessage(messages.cancel)}
            </CapButton>,
            <CapButton
              key="confirm"
              type="primary"
              onClick={handleConfirmOverwrite}
              loading={isSaving}
            >
              {formatMessage(messages.confirm)}
            </CapButton>,
          ]}
        >
          <p>
            {formatMessage(messages.overwriteMessage, {
              configName: newConfig.configName,
            })}
          </p>
        </CustomModal>

        {/* Config Requests Modal */}
        <CustomModal
          title={formatMessage(messages.configRequests)}
          visible={requestsModalVisible}
          onCancel={() => setRequestsModalVisible(false)}
          footer={null}
          width={800}
        >
          <div className="requests-warning">
            {formatMessage(messages.secretsWarning)}
          </div>
          <CapInput
            value={requestSearchQuery}
            placeholder="Search by config name..."
            onChange={handleRequestSearch}
            style={{ width: '100%', marginBottom: 12 }}
          />
          <div style={{ maxHeight: '28rem', overflowY: 'auto', border: '1px solid #e8e8e8', borderRadius: 6 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  {REQUEST_TABLE_COLUMNS.map((col) => (
                    <th key={col.dataIndex} style={{
                      width: col.width,
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#8c8c8c',
                      background: '#fafafa',
                      borderBottom: '1px solid #e8e8e8',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoadingRequests ? (
                  <tr>
                    <td colSpan={REQUEST_TABLE_COLUMNS.length} style={{ padding: '2rem', textAlign: 'center' }}>
                      <CapSpin />
                    </td>
                  </tr>
                ) : configRequests.length === 0 ? (
                  <tr>
                    <td colSpan={REQUEST_TABLE_COLUMNS.length} style={{ padding: '2rem', textAlign: 'center', color: '#8c8c8c' }}>
                      {requestSearchQuery ? 'No matching requests found.' : 'No requests found.'}
                    </td>
                  </tr>
                ) : (
                  configRequests.map((req, idx) => (
                    <tr key={`${req.configName}-${req.user}-${idx}`} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={{ ...tdStyle, ...truncStyle }} title={req.configName}>{req.configName}</td>
                      <td style={{ ...tdStyle, ...truncStyle }} title={req.isSecret ? '***' : req.configValue}>
                        {req.isSecret ? '***' : req.configValue}
                      </td>
                      <td style={tdStyle}>{req.isSecret ? 'Yes' : 'No'}</td>
                      <td style={{ ...tdStyle, ...truncStyle }} title={req.user}>{req.user}</td>
                      <td style={tdStyle}>
                        <span style={statusBadgeStyle(req.status)}>
                          {(req.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <span title="Approve" style={{ cursor: 'pointer', color: '#389e0d', marginRight: 12 }} onClick={() => handleApprove(req)}>
                          <CapIcon type="check" style={{ fontSize: 16 }} />
                        </span>
                        <span title="Reject" style={{ cursor: 'pointer', color: '#cf1322' }} onClick={() => handleReject(req)}>
                          <CapIcon type="close" style={{ fontSize: 16 }} />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CustomModal>
      </CapColumn>
    </CapRow>
  );
};

ConfigManagement.propTypes = {
  className: PropTypes.string,
  configs: PropTypes.array,
  fetchingConfigs: PropTypes.string,
  configRequests: PropTypes.array,
  fetchingConfigRequests: PropTypes.string,
  savingConfig: PropTypes.string,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  configs: makeSelectConfigs(),
  fetchingConfigs: makeSelectFetchingConfigs(),
  configRequests: makeSelectConfigRequests(),
  fetchingConfigRequests: makeSelectFetchingConfigRequests(),
  savingConfig: makeSelectSavingConfig(),
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
)(injectIntl(withStyles(ConfigManagement, styles)));
