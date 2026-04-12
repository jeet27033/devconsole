import React, { useState, useCallback } from "react";
import {
  CapButton,
  CapRow,
  CapColumn,
  CapSelect,
  CapInput,
} from "@capillarytech/cap-ui-library";
import CapHeading from "@capillarytech/cap-ui-library/CapHeading";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import styles from "./style";
import messages from "./messages";
import { withStyles } from "@capillarytech/vulcan-react-sdk/utils";
import { LazyLog } from "@melloware/react-logviewer";
import {
  DUMMY_DATABASES,
  DUMMY_COLLECTIONS,
  DUMMY_QUERY_RESPONSE,
} from "./constants";

const MongodbWorkbench = ({ className, intl: { formatMessage } }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [selectedDb, setSelectedDb] = useState(undefined);
  const [selectedCollection, setSelectedCollection] = useState(undefined);
  const [queryInput, setQueryInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const collectionOptions = selectedDb
    ? DUMMY_COLLECTIONS[selectedDb] || []
    : [];

  const handleDbChange = useCallback((value) => {
    setSelectedDb(value);
    setSelectedCollection(undefined);
  }, []);

  const handleCollectionChange = useCallback((value) => {
    setSelectedCollection(value);
  }, []);

  const handleQueryChange = useCallback((e) => {
    setQueryInput(e.target.value);
  }, []);

  const simulateQuery = useCallback(() => {
    setLoading(true);
    setResponseText("");
    setExecutionTime(null);

    const start = Date.now();
    // Simulated API call delay
    setTimeout(() => {
      const elapsed = Date.now() - start;
      setResponseText(DUMMY_QUERY_RESPONSE);
      setExecutionTime(elapsed);
      setLoading(false);

      // Add tab for query history
      const newTab = {
        key: `tab-${Date.now()}`,
        label: queryInput.substring(0, 30) || "Query",
        response: DUMMY_QUERY_RESPONSE,
        time: elapsed,
      };
      setTabs((prev) => [...prev.slice(-9), newTab]);
      setActiveTab(newTab.key);
    }, 500);
  }, [queryInput]);

  const handleRunQuery = useCallback(() => {
    if (!selectedDb || !selectedCollection || !queryInput) return;
    simulateQuery();
  }, [selectedDb, selectedCollection, queryInput, simulateQuery]);

  const handleLoadSchema = useCallback(() => {
    if (!selectedDb || !selectedCollection) return;
    setLoading(true);
    setTimeout(() => {
      const schema = JSON.stringify(
        {
          collection: selectedCollection,
          fields: {
            _id: "ObjectId",
            name: "String",
            age: "Number",
            email: "String",
            createdAt: "Date",
          },
        },
        null,
        2
      );
      setResponseText(schema);
      setExecutionTime(null);
      setLoading(false);
    }, 300);
  }, [selectedDb, selectedCollection]);

  const handleExplain = useCallback(() => {
    if (!selectedDb || !selectedCollection || !queryInput) return;
    setLoading(true);
    setTimeout(() => {
      const explain = JSON.stringify(
        {
          queryPlanner: {
            plannerVersion: 1,
            namespace: `${selectedDb}.${selectedCollection}`,
            indexFilterSet: false,
            winningPlan: {
              stage: "COLLSCAN",
              direction: "forward",
            },
          },
          executionStats: {
            executionSuccess: true,
            nReturned: 1,
            totalDocsExamined: 150,
            totalKeysExamined: 0,
          },
        },
        null,
        2
      );
      setResponseText(explain);
      setExecutionTime(null);
      setLoading(false);
    }, 400);
  }, [selectedDb, selectedCollection, queryInput]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab.key);
    setResponseText(tab.response);
    setExecutionTime(tab.time);
  }, []);

  const handleTabClose = useCallback(
    (tabKey) => {
      setTabs((prev) => {
        const updated = prev.filter((t) => t.key !== tabKey);
        if (activeTab === tabKey && updated.length > 0) {
          const last = updated[updated.length - 1];
          setActiveTab(last.key);
          setResponseText(last.response);
          setExecutionTime(last.time);
        } else if (updated.length === 0) {
          setActiveTab(null);
          setResponseText("");
          setExecutionTime(null);
        }
        return updated;
      });
    },
    [activeTab]
  );

  const isDisabled = DUMMY_DATABASES.length === 0;
  const canRunQuery = selectedDb && selectedCollection && queryInput && !loading;

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
            <button
              className="syntax-alert-close"
              onClick={() => setShowAlert(false)}
            >
              x
            </button>
          </div>
        )}

        {/* Query Form */}
        <div className="query-form-container">
          <CapRow className="form-field">
            <CapHeading className="form-label" type="h4">
              {formatMessage(messages.selectDatabase)}
            </CapHeading>
            <CapSelect
              className="db-select"
              placeholder={formatMessage(messages.selectDatabasePlaceholder)}
              options={DUMMY_DATABASES}
              value={selectedDb}
              onChange={handleDbChange}
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
              disabled={!canRunQuery || isDisabled}
            >
              {formatMessage(messages.runQuery)}
            </CapButton>
            <CapButton
              type="secondary"
              onClick={handleLoadSchema}
              disabled={!selectedDb || !selectedCollection || loading || isDisabled}
            >
              {formatMessage(messages.loadSchema)}
            </CapButton>
            <CapButton
              type="secondary"
              onClick={handleExplain}
              disabled={!canRunQuery || isDisabled}
            >
              {formatMessage(messages.explain)}
            </CapButton>
            {loading && (
              <span className="loader-icon">
                <span className="spinner" />
              </span>
            )}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClose(tab.key);
                  }}
                >
                  x
                </span>
              </span>
            ))}
          </CapRow>
        )}

        {/* Response Container */}
        <div className="response-container">
          <CapRow
            className="response-header"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <CapHeading type="h3">
              {formatMessage(messages.response)}
            </CapHeading>
            {executionTime !== null && (
              <span className="execution-time">
                {formatMessage(messages.executionTime, { time: executionTime })}
              </span>
            )}
          </CapRow>

          {responseText ? (
            <div className="response-viewer">
              <LazyLog
                text={responseText}
                extraLines={1}
                enableSearch={false}
                caseInsensitive
                selectableLines
              />
            </div>
          ) : (
            <div className="empty-response">
              {formatMessage(messages.noResponse)}
            </div>
          )}
        </div>
      </CapColumn>
    </CapRow>
  );
};

export default withRouter(injectIntl(withStyles(MongodbWorkbench, styles)));
