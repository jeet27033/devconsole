import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { createStructuredSelector } from "reselect";
import {
  CapButton,
  CapRow,
  CapColumn,
  CapTable,
  CapInput,
  CapSelect,
  CapSwitch,
} from "@capillarytech/cap-ui-library";
import CapHeading from "@capillarytech/cap-ui-library/CapHeading";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import {
  injectSaga,
  injectReducer,
  withStyles,
} from "@capillarytech/vulcan-react-sdk/utils";
import styles from "./style";
import messages from "./messages";
import CustomModal from "../../molecules/CustomModal";
import { LazyLog } from "@melloware/react-logviewer";
import { getAuthenticationDetails } from "../../../utils/authWrapper";
import sagas from "./saga";
import reducer from "./reducer";
import * as actions from "./action";
import { REDUCER_KEY } from "./constants";
import {
  makeSelectBuildHistory,
  makeSelectFetchingBuildHistory,
} from "./selectors";
import { REQUEST } from "../../pages/App/constants";

const extensionOptions = [
  { key: "loyalty", label: "Loyalty Extension", value: "loyalty" },
  { key: "campaign", label: "Campaign Extension", value: "campaign" },
  { key: "rewards", label: "Rewards Extension", value: "rewards" },
];

const branchOptions = [
  { key: "main", label: "main", value: "main" },
  { key: "develop", label: "develop", value: "develop" },
  { key: "feature/rewards-v3", label: "feature/rewards-v3", value: "feature/rewards-v3" },
];

const tagOptions = [
  { key: "v1.0.0", label: "v1.0.0", value: "v1.0.0" },
  { key: "v2.1.0", label: "v2.1.0", value: "v2.1.0" },
  { key: "v3.0.0-beta", label: "v3.0.0-beta", value: "v3.0.0-beta" },
];

const SEARCHABLE_KEYS = [
  "buildId",
  "name",
  "branchOrTag",
  "version",
  "description",
  "by",
];

const DEBOUNCE_MS = 300;

const BUILD_DETAIL_FIELDS = [
  "buildId",
  "dateTime",
  "by",
  "status",
  "name",
  "branchOrTag",
  "version",
  "description",
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
  consoleLogs: row.consoleLogs || "",
});

const ExtensionsDeployment = ({
  className,
  intl: { formatMessage },
  buildHistory,
  fetchingBuildHistory,
  actions: boundActions,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [useBranches, setUseBranches] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    boundActions.getExtensionsBuildHistory();
  }, [boundActions]);

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
  };

  const tableData = useMemo(
    () => (buildHistory || []).map(mapBuildHistoryRow),
    [buildHistory],
  );

  const columns = [
    { title: formatMessage(messages.buildId), dataIndex: "buildId", key: "buildId" },
    { title: formatMessage(messages.name), dataIndex: "name", key: "name" },
    { title: formatMessage(messages.branchOrTag), dataIndex: "branchOrTag", key: "branchOrTag" },
    { title: formatMessage(messages.status), dataIndex: "status", key: "status" },
    { title: formatMessage(messages.version), dataIndex: "version", key: "version" },
    { title: formatMessage(messages.description), dataIndex: "description", key: "description" },
    { title: formatMessage(messages.by), dataIndex: "by", key: "by" },
    { title: formatMessage(messages.dateTime), dataIndex: "dateTime", key: "dateTime" },
    {
      title: formatMessage(messages.logs),
      dataIndex: "logs",
      key: "logs",
      align: "center",
      render: (_, record) => (
        <CapButton type="link" className="viewLogsLink" onClick={() => handleViewLogs(record)}>
          {formatMessage(messages.view)}
        </CapButton>
      ),
    },
  ];

  const filteredData = tableData.filter((row) => {
    if (!searchText) return true;
    const query = searchText.toLowerCase();
    return SEARCHABLE_KEYS.some((key) =>
      (row[key] || "").toString().toLowerCase().includes(query)
    );
  });

  return (
    <CapRow className={className}>
      <CapColumn span={24}>
        <CapRow className="topBarRow" type="flex" justify="space-between" align="middle">
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
            <CapButton type="secondary" key="cancel" onClick={() => setModalVisible(false)}>
              {formatMessage(messages.cancel)}
            </CapButton>,
            <CapButton key="build" type="primary">
              {formatMessage(messages.startBuild)}
            </CapButton>,
          ]}
        >
          <CapRow className="deployModalFormItem" style={{"padding-bottom": "3%"}}>
            <CapHeading className="deployModalFormLabel" type="h4">
              {formatMessage(messages.extensionList)}
            </CapHeading>
            <CapSelect
              style={{ width: '100%' }}
              placeholder={formatMessage(messages.selectExtension)}
              options={extensionOptions}
            />
          </CapRow>
          <CapRow className="deployModalFormItem" style={{"padding-bottom": "3%"}}>
            <CapHeading className="deployModalFormLabel" type="h4">
              {formatMessage(messages.githubUrl)}
            </CapHeading>
            <CapInput placeholder={formatMessage(messages.githubUrlPlaceholder)} />
          </CapRow>
          <CapRow className="deployModalFormItem" style={{"padding-bottom": "3%"}}>
            <CapHeading className="deployModalFormLabel" type="h4" style={{"padding-bottom": "1%"}}>
              {formatMessage(messages.branchesOrTags)}
            </CapHeading>
            <CapRow className="deployModalSwitchRow" type="flex" align="middle" style={{"padding-bottom": "1%"}}>
              <span>{formatMessage(messages.tags)}</span>
              <CapSwitch
                checked={useBranches}
                onChange={(checked) => setUseBranches(checked)}
                style={{ "margin-left" : "2%" , "margin-right" : "2%"}}
              />
              <span>{formatMessage(messages.branches)}</span>
            </CapRow>
            <CapSelect
              style={{ width: '100%' }}
              placeholder={formatMessage(messages.selectBranchOrTag)}
              options={useBranches ? branchOptions : tagOptions}
            />
          </CapRow>
          <CapRow className="deployModalFormItem" style={{"padding-bottom": "3%"}}>
            <CapHeading className="deployModalFormLabel" type="h4">
              {formatMessage(messages.buildDescription)}
            </CapHeading>
            <CapInput placeholder={formatMessage(messages.buildDescriptionPlaceholder)} />
          </CapRow>
        </CustomModal>

        {/* Build Logs Modal */}
        <CustomModal
          title={formatMessage(messages.buildLogs)}
          visible={logsModalVisible}
          onCancel={() => setLogsModalVisible(false)}
          footer={null}
          width={900}
          className="logsModal"
        >
          {selectedBuild && (
            <CapRow type="flex" gutter={16} className="logsModalContent">
              <CapColumn span={9} className="logsDetailPane">
                <CapTable
                  className="logsModalDetailTable"
                  showHeader={false}
                  pagination={false}
                  columns={[
                    {
                      dataIndex: "label",
                      key: "label",
                      width: "40%",
                      render: (text) => (
                        <CapHeading className="logsModalDetailLabel" type="h5">
                          {text}
                        </CapHeading>
                      ),
                    },
                    {
                      dataIndex: "value",
                      key: "value",
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
                  text={selectedBuild.consoleLogs}
                  extraLines={1}
                  enableSearch={false}
                  caseInsensitive
                  selectableLines
                />
              </CapColumn>
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
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  buildHistory: makeSelectBuildHistory(),
  fetchingBuildHistory: makeSelectFetchingBuildHistory(),
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
