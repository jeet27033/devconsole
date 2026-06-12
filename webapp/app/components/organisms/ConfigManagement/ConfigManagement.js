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
  CapButton,
  CapCheckbox,
} from '@capillarytech/cap-ui-library';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import CustomModal from '../../molecules/CustomModal';

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

  const dispatchSave = useCallback(() => {
    boundActions.saveConfig({
      payload: {
        configName: newConfig.configName,
        configValue: newConfig.configValue,
        isSecret: newConfig.isSecret,
      },
      userMail: '',
      status: CONFIG_STATUS.PENDING,
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
    boundActions.getConfigRequests({ status: CONFIG_STATUS.PENDING });
    setRequestsModalVisible(true);
  }, [boundActions]);

  const isLoadingConfigs = fetchingConfigs === REQUEST;
  const isLoadingRequests = fetchingConfigRequests === REQUEST;
  const isSaving = savingConfig === REQUEST;
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
                {isLoadingRequests ? (
                  <tr>
                    <td colSpan={REQUEST_TABLE_COLUMNS.length}>
                      <div className="empty-state">
                        <CapSpin />
                      </div>
                    </td>
                  </tr>
                ) : configRequests.length === 0 ? (
                  <tr>
                    <td colSpan={REQUEST_TABLE_COLUMNS.length}>
                      <div className="empty-state">No requests found.</div>
                    </td>
                  </tr>
                ) : (
                  configRequests.map((req, idx) => (
                    <tr key={req.id ?? `${req.configName}-${idx}`}>
                      <td>{req.id ?? idx + 1}</td>
                      <td>{req.configName}</td>
                      <td>{req.isSecret ? '••••••' : req.configValue}</td>
                      <td>{req.isSecret ? 'Yes' : 'No'}</td>
                      <td>{req.user ?? req.submittedBy}</td>
                      <td>{req.status}</td>
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
