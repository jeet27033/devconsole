import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  CapButton,
  CapRow,
  CapColumn,
  CapSelect,
  CapInput,
} from "@capillarytech/cap-ui-library";
import CapSpin from "@capillarytech/cap-ui-library/CapSpin";
import CapHeading from "@capillarytech/cap-ui-library/CapHeading";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import styles from "./style";
import messages from "./messages";
import { injectSaga, injectReducer, withStyles } from "@capillarytech/vulcan-react-sdk/utils";
import { LazyLog } from "@melloware/react-logviewer";
import { MAX_QUERY_TABS, REDUCER_KEY } from "./constants";
import sagas from './saga';
import reducer from './reducer';
import * as actions from './action';
import {
  makeSelectDatabases,
  makeSelectFetchingDBs,
  makeSelectCollections,
  makeSelectFetchingCollections,
  makeSelectQueryResult,
  makeSelectQueryExecutionTime,
  makeSelectExecutingQuery,
  makeSelectQueryError,
  makeSelectSchema,
  makeSelectFetchingSchema,
  makeSelectSchemaError,
} from './selectors';
import { REQUEST, SUCCESS, FAILURE } from '../../pages/App/constants';

const MongodbWorkbench = ({
  className,
  intl: { formatMessage },
  databases,
  fetchingDBs,
  collections,
  fetchingCollections,
  queryResult,
  queryExecutionTime,
  executingQuery,
  queryError,
  schema,
  fetchingSchema,
  schemaError,
  actions: boundActions,
}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [selectedDb, setSelectedDb] = useState(undefined);
  const [selectedCollection, setSelectedCollection] = useState(undefined);
  const [queryInput, setQueryInput] = useState("");
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    boundActions.getOrgDBs();
  }, [boundActions]);

  useEffect(() => {
    if (executingQuery === SUCCESS && queryResult !== null) {
      const newTab = {
        key: `tab-${Date.now()}`,
        label: queryInput.substring(0, 30) || 'Query',
        result: queryResult,
        time: queryExecutionTime,
      };
      setTabs((prev) => [...prev.slice(-(MAX_QUERY_TABS - 1)), newTab]);
      setActiveTab(newTab.key);
    }
  }, [executingQuery, queryResult]);

  const activeTabData = tabs.find((t) => t.key === activeTab);
  const displayResult = activeTabData?.result ?? null;
  const displayTime = activeTabData?.time ?? null;

  const dbOptions = (databases || []).map((db) => ({ key: db, label: db, value: db }));
  const collectionOptions = (collections || []).map((c) => ({ key: c, label: c, value: c }));

  const handleDbChange = useCallback((value) => {
    setSelectedDb(value);
    setSelectedCollection(undefined);
    boundActions.getDBCollections(value);
    boundActions.clearMongoSchema();
  }, [boundActions]);

  const handleCollectionChange = useCallback((value) => {
    setSelectedCollection(value);
    boundActions.clearMongoSchema();
  }, [boundActions]);

  const handleQueryChange = useCallback((e) => {
    setQueryInput(e.target.value);
  }, []);

  const handleRunQuery = useCallback(() => {
    if (!selectedDb || !selectedCollection || !queryInput) return;
    boundActions.executeMongoQuery(selectedDb, queryInput);
  }, [selectedDb, selectedCollection, queryInput, boundActions]);

  const handleLoadSchema = useCallback(() => {
    if (!selectedDb || !selectedCollection) return;
    boundActions.getMongoSchema(selectedDb, selectedCollection);
  }, [selectedDb, selectedCollection, boundActions]);

  const handleExplain = useCallback(() => {
    if (!selectedDb || !selectedCollection || !queryInput) return;
    const explainQuery = `${queryInput.trimEnd()}.explain("executionStats")`;
    boundActions.executeMongoQuery(selectedDb, explainQuery);
  }, [selectedDb, selectedCollection, queryInput, boundActions]);

  const handleSchemaFieldClick = useCallback((fieldName) => {
    const snippet = `db["${selectedCollection}"].find({ "${fieldName}": <value> })`;
    setQueryInput(snippet);
  }, [selectedCollection]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab.key);
  }, []);

  const handleTabClose = useCallback((tabKey) => {
    setTabs((prev) => {
      const updated = prev.filter((t) => t.key !== tabKey);
      if (activeTab === tabKey) {
        setActiveTab(updated.length > 0 ? updated[updated.length - 1].key : null);
      }
      return updated;
    });
  }, [activeTab]);

  const isLoadingDBs = fetchingDBs === REQUEST;
  const isLoadingCollections = fetchingCollections === REQUEST;
  const isRunning = executingQuery === REQUEST;
  const isLoadingSchema = fetchingSchema === REQUEST;
  const canRunQuery = selectedDb && selectedCollection && queryInput && !isRunning;
  const hasSchema = schema && schema.length > 0;

  return (
    <CapRow className={`${className} mongodb-workbench`}>
      <CapColumn span={24}>
        {/* Syntax Notice Alert */}
        {showAlert && (
          <div className="syntax-alert">
            <span className="syntax-alert-text">
              <strong>{formatMessage(messages.syntaxNoticeTitle)}</strong>{" "}
              {formatMessage(messages.syntaxNoticeBody)}{" "}
              For syntax reference and examples, please visit the{" "}
              <a
                href="https://www.mongodb.com/docs/mongodb-shell/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatMessage(messages.syntaxNoticeLink)}
              </a>
              .
            </span>
            <button className="syntax-alert-close" onClick={() => setShowAlert(false)}>x</button>
          </div>
        )}

        <div className="workbench-body">
          {/* Schema Panel */}
          <div className="schema-panel">
            <div className="schema-panel-header">{formatMessage(messages.schemaTitle)}</div>
            <CapSpin spinning={isLoadingSchema}>
              <div className="schema-panel-body">
                {schemaError ? (
                  <div className="schema-empty" style={{ color: '#cf1322' }}>
                    {formatMessage(messages.schemaError)}
                  </div>
                ) : hasSchema ? (
                  schema.map((field) => (
                    <div
                      key={field.field}
                      className="schema-field-row"
                      title={`Click to use ${field.field} in query`}
                      onClick={() => handleSchemaFieldClick(field.field)}
                    >
                      <span className="schema-field-name">{field.field}</span>
                      <span className="schema-type-badge">
                        {(field.types || []).filter((t) => t !== 'null').join(' | ') || 'null'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="schema-empty">{formatMessage(messages.schemaEmpty)}</div>
                )}
              </div>
            </CapSpin>
          </div>

          {/* Main Panel */}
          <div className="main-panel">
            {/* Query Form */}
            <div className="query-form-container">
              <CapRow className="form-field">
                <CapHeading className="form-label" type="h4">
                  {formatMessage(messages.selectDatabase)}
                </CapHeading>
                <CapSelect
                  className="db-select"
                  placeholder={formatMessage(messages.selectDatabasePlaceholder)}
                  options={dbOptions}
                  value={selectedDb}
                  onChange={handleDbChange}
                  loading={isLoadingDBs}
                  style={{ width: '100%' }}
                />
              </CapRow>

              <CapRow className="form-field">
                <CapHeading className="form-label" type="h4">
                  {formatMessage(messages.selectCollection)}
                </CapHeading>
                <CapSelect
                  className="coll-select"
                  placeholder={formatMessage(messages.selectCollectionPlaceholder)}
                  options={collectionOptions}
                  value={selectedCollection}
                  onChange={handleCollectionChange}
                  disabled={!selectedDb}
                  loading={isLoadingCollections}
                  style={{ width: '100%' }}
                />
              </CapRow>

              <CapRow className="form-field">
                <CapHeading className="form-label" type="h4">
                  {formatMessage(messages.writeQuery)}
                </CapHeading>
                <CapInput.TextArea
                  className="query-textarea"
                  placeholder={formatMessage(messages.queryPlaceholder)}
                  value={queryInput}
                  onChange={handleQueryChange}
                  rows={5}
                />
              </CapRow>

              <CapRow className="action-buttons" type="flex" align="middle">
                <CapButton
                  type="primary"
                  onClick={handleRunQuery}
                  disabled={!canRunQuery}
                  loading={isRunning}
                >
                  {formatMessage(messages.runQuery)}
                </CapButton>
                <CapButton
                  type="secondary"
                  onClick={handleLoadSchema}
                  disabled={!selectedDb || !selectedCollection || isLoadingSchema}
                  loading={isLoadingSchema}
                >
                  {formatMessage(messages.loadSchema)}
                </CapButton>
                <CapButton
                  type="secondary"
                  onClick={handleExplain}
                  disabled={!canRunQuery}
                >
                  {formatMessage(messages.explain)}
                </CapButton>
              </CapRow>
            </div>

            {/* Query Tabs */}
            {tabs.length > 0 && (
              <CapRow className="query-tabs-row" type="flex" align="middle">
                {tabs.map((tab) => (
                  <span
                    key={tab.key}
                    className={`query-tab${activeTab === tab.key ? " active" : ""}`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.label}
                    <span
                      className="query-tab-close"
                      onClick={(e) => { e.stopPropagation(); handleTabClose(tab.key); }}
                    >
                      x
                    </span>
                  </span>
                ))}
              </CapRow>
            )}

            {/* Response Container */}
            <div className="response-container">
              <CapRow className="response-header" type="flex" justify="space-between" align="middle">
                <CapHeading type="h3">{formatMessage(messages.response)}</CapHeading>
                {displayTime !== null && (
                  <span className="execution-time">
                    {formatMessage(messages.executionTime, { time: displayTime })}
                  </span>
                )}
              </CapRow>

              {queryError && executingQuery === FAILURE && (
                <div className="empty-response" style={{ color: '#cf1322' }}>{queryError}</div>
              )}

              {displayResult ? (
                <div className="response-viewer">
                  <LazyLog
                    text={displayResult}
                    extraLines={1}
                    enableSearch={false}
                    caseInsensitive
                    selectableLines
                  />
                </div>
              ) : !queryError && (
                <div className="empty-response">{formatMessage(messages.noResponse)}</div>
              )}
            </div>
          </div>
        </div>
      </CapColumn>
    </CapRow>
  );
};

const mapStateToProps = createStructuredSelector({
  databases: makeSelectDatabases(),
  fetchingDBs: makeSelectFetchingDBs(),
  collections: makeSelectCollections(),
  fetchingCollections: makeSelectFetchingCollections(),
  queryResult: makeSelectQueryResult(),
  queryExecutionTime: makeSelectQueryExecutionTime(),
  executingQuery: makeSelectExecutingQuery(),
  queryError: makeSelectQueryError(),
  schema: makeSelectSchema(),
  fetchingSchema: makeSelectFetchingSchema(),
  schemaError: makeSelectSchemaError(),
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
)(injectIntl(withStyles(MongodbWorkbench, styles))));
