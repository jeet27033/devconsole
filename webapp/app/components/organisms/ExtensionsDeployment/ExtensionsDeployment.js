import React, { useState, useCallback, useRef } from "react";
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
import styles from "./style";
import messages from "./messages";
import { withStyles } from "@capillarytech/vulcan-react-sdk/utils";
import CustomModal from "../../molecules/CustomModal";
import { LazyLog } from "@melloware/react-logviewer";

const dummyData = [
  {
    key: "1",
    buildId: "59",
    extensionName: "@capillarytech/hertz-loyaltyware-integration",
    branchOrTag: "dev",
    status: "SUCCESS",
    version: "1.16.5",
    description: "Fix for CAP-151249",
    triggeredBy: "muddasani.mahesh@capillarytech.com",
    dateTime: "2026-03-03T10:51:09",
    consoleLogs: `[EnvInject] - Loading node environment variables.
Building in workspace /bitnami/jenkins/home/workspace/hertz-loyaltyware-integration
[hertz-loyaltyware-integration] $ /bin/sh -xe /tmp/jenkins15768460679437265158.sh
+ export NVM_DIR=/bitnami/jenkins/home/.nvm
+ [ ! -s /bitnami/jenkins/home/.nvm/nvm.sh ]
+ . /bitnami/jenkins/home/.nvm/nvm.sh
+ NVM_SCRIPT_SOURCE=
+ [ -z ]
+ export NVM_CD_FLAGS=
+ nvm_is_zsh
+ [ -n ]
+ [ -z /bitnami/jenkins/home/.nvm ]
+ unset NVM_SCRIPT_SOURCE
+ nvm_process_parameters
+ local NVM_AUTO_MODE=use
+ NVM_AUTO_MODE=use
+ [ 0 -ne 0 ]
+ nvm_auto use
+ local NVM_MODE
+ NVM_MODE=use
BUILD SUCCESSFUL`,
  },
  {
    key: "2",
    buildId: "BLD-002",
    extensionName: "Campaign Extension",
    branchOrTag: "v2.1.0",
    status: "Failed",
    version: "2.1.0",
    description: "Hotfix for campaign flow",
    triggeredBy: "jane.smith@capillary.com",
    dateTime: "2026-04-09 10:15",
    consoleLogs: `[EnvInject] - Loading node environment variables.
Building in workspace /bitnami/jenkins/home/workspace/campaign-extension
ERROR: Build failed with exit code 1
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! campaign-extension@2.1.0 build: node scripts/build.js
npm ERR! Exit status 1
BUILD FAILED`,
  },
  {
    key: "3",
    buildId: "BLD-003",
    extensionName: "Rewards Extension",
    branchOrTag: "feature/rewards-v3",
    status: "In Progress",
    version: "3.0.0-beta",
    description: "New rewards module",
    triggeredBy: "alex.kumar@capillary.com",
    dateTime: "2026-04-11 09:00",
    consoleLogs: `[EnvInject] - Loading node environment variables.
Building in workspace /bitnami/jenkins/home/workspace/rewards-extension
[rewards-extension] $ /bin/sh -xe /tmp/jenkins98234756.sh
+ npm install
added 1247 packages in 45s
+ npm run build
Building rewards module v3.0.0-beta...`,
  },
];

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
  "extensionName",
  "branchOrTag",
  "version",
  "description",
  "triggeredBy",
];

const DEBOUNCE_MS = 300;

const BUILD_DETAIL_FIELDS = [
  "buildId",
  "dateTime",
  "triggeredBy",
  "status",
  "extensionName",
  "branchOrTag",
  "version",
  "description",
];

const ExtensionsDeployment = ({ className, intl: { formatMessage } }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [useBranches, setUseBranches] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef(null);

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

  const columns = [
    { title: formatMessage(messages.buildId), dataIndex: "buildId", key: "buildId" },
    { title: formatMessage(messages.extensionName), dataIndex: "extensionName", key: "extensionName" },
    { title: formatMessage(messages.branchOrTag), dataIndex: "branchOrTag", key: "branchOrTag" },
    { title: formatMessage(messages.status), dataIndex: "status", key: "status" },
    { title: formatMessage(messages.version), dataIndex: "version", key: "version" },
    { title: formatMessage(messages.description), dataIndex: "description", key: "description" },
    { title: formatMessage(messages.triggeredBy), dataIndex: "triggeredBy", key: "triggeredBy" },
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

  const filteredData = dummyData.filter((row) => {
    if (!searchText) return true;
    const query = searchText.toLowerCase();
    return SEARCHABLE_KEYS.some((key) =>
      (row[key] || "").toLowerCase().includes(query)
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

        <CapTable columns={columns} dataSource={filteredData} />

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
        >
          {selectedBuild && (
            <CapRow type="flex" gutter={16}>
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
                  height={400}
                />
              </CapColumn>
            </CapRow>
          )}
        </CustomModal>
      </CapColumn>
    </CapRow>
  );
};

export default withRouter(injectIntl(withStyles(ExtensionsDeployment, styles)));
