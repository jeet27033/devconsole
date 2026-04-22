import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  CapButton,
  CapRow,
  CapColumn,
  CapTable,
  CapInput,
  CapSelect,
  CapSwitch,
} from '@capillarytech/cap-ui-library';
import CapHeading from '@capillarytech/cap-ui-library/CapHeading';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import {
  injectSaga,
  injectReducer,
  withStyles,
} from '@capillarytech/vulcan-react-sdk/utils';
import styles from './style';
import messages from './messages';
import CustomModal from '../../molecules/CustomModal';
import { LazyLog } from '@melloware/react-logviewer';
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import { REDUCER_KEY } from './constants';
import {
  makeSelectBuildHistory,
  makeSelectFetchingBuildHistory,
  makeSelectBuildLogs,
  makeSelectFetchingBuildLogs,
  makeSelectBuildMeta,
  makeSelectFetchingBuildMeta,
  makeSelectTriggeringBuild,
} from './selectors';
import { REQUEST, SUCCESS } from '../../pages/App/constants';

const SEARCHABLE_KEYS = [
  'buildId',
  'name',
  'branchOrTag',
  'version',
  'description',
  'by',
];

const DEBOUNCE_MS = 300;

const BUILD_DETAIL_FIELDS = [
  'buildId',
  'dateTime',
  'by',
  'status',
  'name',
  'branchOrTag',
  'version',
  'description',
];

const mapBuildHistoryRow = (row) => ({
  key: String(row.depId),
  buildId: String(row.depId),
  name: row.extensionName,
  branchOrTag: row.branchOrTag,
  status: row.status,
  version: row.version,
  description: row.description,
  by: row.triggeredBy,
  dateTime: row.auto_update_time,
});

const stripGitSuffix = (url = '') => url.replace(/\.git$/, '');

const ExtensionsDeployment = ({
  className,
  intl: { formatMessage },
  buildHistory,
  fetchingBuildHistory,
  buildLogs,
  fetchingBuildLogs,
  buildMeta,
  fetchingBuildMeta,
  triggeringBuild,
  actions: boundActions,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [useBranches, setUseBranches] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedExtension, setSelectedExtension] = useState(null);
  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState(null);
  const [description, setDescription] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    boundActions.getExtensionsBuildHistory();
  }, [boundActions]);

  useEffect(() => {
    if (modalVisible) {
      boundActions.getExtensionsBuildMeta();
    } else {
      setSelectedExtension(null);
      setSelectedBranchOrTag(null);
      setDescription('');
      setUseBranches(true);
    }
  }, [modalVisible, boundActions]);

  useEffect(() => {
    if (triggeringBuild === SUCCESS && modalVisible) {
      setModalVisible(false);
      boundActions.resetTriggerExtensionsBuild();
    }
  }, [triggeringBuild, modalVisible, boundActions]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchText(value);
    }, DEBOUNCE_MS);
  }, []);

  const handleViewLogs = (record) => {
    setSelectedBuild(record);
    setLogsModalVisible(true);
    boundActions.getExtensionsBuildLogs({
      buildId: Number(record.buildId),
      extensionName: record.name,
    });
  };

  const handleCloseLogsModal = () => {
    setLogsModalVisible(false);
    setSelectedBuild(null);
    boundActions.clearExtensionsBuildLogs();
  };

  const selectedExtensionMeta = useMemo(
    () =>
      (buildMeta || []).find((m) => m.packageName === selectedExtension) ||
      null,
    [buildMeta, selectedExtension],
  );

  const extensionOptions = useMemo(
    () =>
      (buildMeta || []).map((m) => ({
        key: m.packageName,
        label: m.packageName,
        value: m.packageName,
      })),
    [buildMeta],
  );

  const branchOptions = useMemo(
    () =>
      (selectedExtensionMeta?.branches || []).map((b) => ({
        key: b,
        label: b,
        value: b,
      })),
    [selectedExtensionMeta],
  );

  const tagOptions = useMemo(
    () =>
      (selectedExtensionMeta?.tags || []).map((t) => ({
        key: t,
        label: t,
        value: t,
      })),
    [selectedExtensionMeta],
  );

  const handleExtensionChange = (value) => {
    setSelectedExtension(value);
    setSelectedBranchOrTag(null);
  };

  const handleBranchOrTagToggle = (checked) => {
    setUseBranches(checked);
    setSelectedBranchOrTag(null);
  };

  const handleStartBuild = () => {
    if (!selectedExtensionMeta || !selectedBranchOrTag) return;
    boundActions.triggerExtensionsBuild({
      description: description || '',
      extensionName: selectedExtensionMeta.packageName,
      githubUrl: stripGitSuffix(selectedExtensionMeta.repoLink || ''),
      branchOrTag: selectedBranchOrTag,
    });
  };

  const tableData = useMemo(
    () => (buildHistory || []).map(mapBuildHistoryRow),
    [buildHistory],
  );

  const columns = [
    {
      title: formatMessage(messages.buildId),
      dataIndex: 'buildId',
      key: 'buildId',
    },
    { title: formatMessage(messages.name), dataIndex: 'name', key: 'name' },
    {
      title: formatMessage(messages.branchOrTag),
      dataIndex: 'branchOrTag',
      key: 'branchOrTag',
    },
    {
      title: formatMessage(messages.status),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: formatMessage(messages.version),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: formatMessage(messages.description),
      dataIndex: 'description',
      key: 'description',
    },
    { title: formatMessage(messages.by), dataIndex: 'by', key: 'by' },
    {
      title: formatMessage(messages.dateTime),
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: formatMessage(messages.logs),
      dataIndex: 'logs',
      key: 'logs',
      align: 'center',
      render: (_, record) => (
        <CapButton
          type="link"
          className="viewLogsLink"
          onClick={() => handleViewLogs(record)}
        >
          {formatMessage(messages.view)}
        </CapButton>
      ),
    },
  ];

  const filteredData = tableData.filter((row) => {
    if (!searchText) return true;
    const query = searchText.toLowerCase();
    return SEARCHABLE_KEYS.some((key) =>
      (row[key] || '').toString().toLowerCase().includes(query),
    );
  });

  const isStartBuildDisabled =
    !selectedExtension ||
    !selectedBranchOrTag ||
    triggeringBuild === REQUEST;

  return (
    <CapRow className={className}>
      <CapColumn span={24}>
        <CapRow
          className="topBarRow"
          type="flex"
          justify="space-between"
          align="middle"
        >
          <CapColumn>
            <CapInput
              className="searchInput"
              placeholder={formatMessage(messages.searchPlaceholder)}
              value={inputValue}
              onChange={handleSearchChange}
            />
          </CapColumn>
          <CapColumn>
            <CapButton type="primary" onClick={() => setModalVisible(true)}>
              {formatMessage(messages.deployExtension)}
            </CapButton>
          </CapColumn>
        </CapRow>

        <CapTable
          columns={columns}
          dataSource={filteredData}
          loading={fetchingBuildHistory === REQUEST}
        />

        {/* Deploy Extension Modal */}
        <CustomModal
          title={formatMessage(messages.enterBuildDescription)}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <CapButton
              type="secondary"
              key="cancel"
              onClick={() => setModalVisible(false)}
            >
              {formatMessage(messages.cancel)}
            </CapButton>,
            <CapButton
              key="build"
              type="primary"
              onClick={handleStartBuild}
              loading={triggeringBuild === REQUEST}
              disabled={isStartBuildDisabled}
            >
              {formatMessage(messages.startBuild)}
            </CapButton>,
          ]}
        >
          <CapRow
            className="deployModalFormItem"
            style={{ 'padding-bottom': '3%' }}
          >
            <CapHeading className="deployModalFormLabel" type="h4">
              {formatMessage(messages.extensionList)}
            </CapHeading>
            <CapSelect
              style={{ width: '100%' }}
              placeholder={formatMessage(messages.selectExtension)}
              options={extensionOptions}
              loading={fetchingBuildMeta === REQUEST}
              value={selectedExtension || undefined}
              onChange={handleExtensionChange}
            />
          </CapRow>
          <CapRow
            className="deployModalFormItem"
            style={{ 'padding-bottom': '3%' }}
          >
            <CapHeading className="deployModalFormLabel" type="h4">
              {formatMessage(messages.githubUrl)}
            </CapHeading>
            <CapInput
              placeholder={formatMessage(messages.githubUrlPlaceholder)}
              value={stripGitSuffix(selectedExtensionMeta?.repoLink || '')}
              disabled
            />
          </CapRow>
          <CapRow
            className="deployModalFormItem"
            style={{ 'padding-bottom': '3%' }}
          >
            <CapHeading
              className="deployModalFormLabel"
              type="h4"
              style={{ 'padding-bottom': '1%' }}
            >
              {formatMessage(messages.branchesOrTags)}
            </CapHeading>
            <CapRow
              className="deployModalSwitchRow"
              type="flex"
              align="middle"
              style={{ 'padding-bottom': '1%' }}
            >
              <span>{formatMessage(messages.tags)}</span>
              <CapSwitch
                checked={useBranches}
                onChange={handleBranchOrTagToggle}
                style={{ 'margin-left': '2%', 'margin-right': '2%' }}
              />
              <span>{formatMessage(messages.branches)}</span>
            </CapRow>
            <CapSelect
              style={{ width: '100%' }}
              placeholder={formatMessage(messages.selectBranchOrTag)}
              options={useBranches ? branchOptions : tagOptions}
              value={selectedBranchOrTag || undefined}
              onChange={setSelectedBranchOrTag}
              disabled={!selectedExtension}
            />
          </CapRow>
          <CapRow
            className="deployModalFormItem"
            style={{ 'padding-bottom': '3%' }}
          >
            <CapHeading className="deployModalFormLabel" type="h4">
              {formatMessage(messages.buildDescription)}
            </CapHeading>
            <CapInput
              placeholder={formatMessage(messages.buildDescriptionPlaceholder)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CapRow>
        </CustomModal>

        {/* Build Logs Modal */}
        <CustomModal
          title={formatMessage(messages.buildLogs)}
          visible={logsModalVisible}
          onCancel={handleCloseLogsModal}
          footer={null}
          width={900}
          className="logsModal"
        >
          {selectedBuild && (
            <CapRow>
              <CapRow
                type="flex"
                gutter={16}
                className="logsModalContent"
              >
                <CapColumn span={9} className="logsDetailPane">
                  <CapTable
                    className="logsModalDetailTable"
                    showHeader={false}
                    pagination={false}
                    columns={[
                      {
                        dataIndex: 'label',
                        key: 'label',
                        width: '40%',
                        render: (text) => (
                          <CapHeading
                            className="logsModalDetailLabel"
                            type="h5"
                          >
                            {text}
                          </CapHeading>
                        ),
                      },
                      {
                        dataIndex: 'value',
                        key: 'value',
                        render: (text) => (
                          <span className="logsModalDetailValue">{text}</span>
                        ),
                      },
                    ]}
                    dataSource={BUILD_DETAIL_FIELDS.map((field) => ({
                      key: field,
                      label: formatMessage(messages[field]),
                      value: selectedBuild[field],
                    }))}
                  />
                </CapColumn>
                <CapColumn span={15} className="logsConsolePane">
                  <LazyLog
                    text={
                      fetchingBuildLogs === REQUEST
                        ? 'Loading logs...'
                        : buildLogs || 'No logs available'
                    }
                    height="auto"
                    extraLines={1}
                    enableSearch={false}
                    caseInsensitive
                    selectableLines
                  />
                </CapColumn>
              </CapRow>
            </CapRow>
          )}
        </CustomModal>
      </CapColumn>
    </CapRow>
  );
};

ExtensionsDeployment.propTypes = {
  className: PropTypes.string,
  buildHistory: PropTypes.array,
  fetchingBuildHistory: PropTypes.string,
  buildLogs: PropTypes.string,
  fetchingBuildLogs: PropTypes.string,
  buildMeta: PropTypes.array,
  fetchingBuildMeta: PropTypes.string,
  triggeringBuild: PropTypes.string,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  buildHistory: makeSelectBuildHistory(),
  fetchingBuildHistory: makeSelectFetchingBuildHistory(),
  buildLogs: makeSelectBuildLogs(),
  fetchingBuildLogs: makeSelectFetchingBuildLogs(),
  buildMeta: makeSelectBuildMeta(),
  fetchingBuildMeta: makeSelectFetchingBuildMeta(),
  triggeringBuild: makeSelectTriggeringBuild(),
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
)(withRouter(injectIntl(withStyles(ExtensionsDeployment, styles))));
