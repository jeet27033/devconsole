import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  CapRow,
  CapColumn,
  CapTable,
  CapInput,
  CapSelect,
} from "@capillarytech/cap-ui-library";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import styles from "./styles";
import messages from "./messages";
import { withStyles } from "@capillarytech/vulcan-react-sdk/utils";
import { STATUS_OPTIONS, DUMMY_AUDIT_DATA, DEBOUNCE_MS } from "./constants";

const STATUS_DISPLAY = {
  success: "Success",
  failed: "Failed",
  pending_approval: "Pending Approval",
  rejected: "Rejected",
};

const DBAuditLog = ({ className, intl: { formatMessage } }) => {
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const debounceRef = useRef(null);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchText(value);
    }, DEBOUNCE_MS);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setSelectedStatus(value);
  }, []);

  const filteredData = useMemo(() => {
    return DUMMY_AUDIT_DATA.filter((row) => {
      const query = searchText.toLowerCase();
      const matchesSearch =
        !query ||
        row.id.toLowerCase().includes(query) ||
        row.createdBy.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "all" || row.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchText, selectedStatus]);

  const columns = [
    {
      title: formatMessage(messages.columnId),
      dataIndex: "id",
      key: "id",
      width: "8%",
    },
    {
      title: formatMessage(messages.columnQuery),
      dataIndex: "query",
      key: "query",
      width: "30%",
      render: (text) => <span className="query-cell" title={text}>{text}</span>,
    },
    {
      title: formatMessage(messages.columnCreatedBy),
      dataIndex: "createdBy",
      key: "createdBy",
      width: "18%",
    },
    {
      title: formatMessage(messages.columnCreatedOn),
      dataIndex: "createdOn",
      key: "createdOn",
      width: "16%",
    },
    {
      title: formatMessage(messages.columnStatus),
      dataIndex: "status",
      key: "status",
      width: "14%",
      render: (status) => (
        <span className={`status-badge status-${status}`}>
          {STATUS_DISPLAY[status] || status}
        </span>
      ),
    },
    {
      title: formatMessage(messages.columnExecutionTime),
      dataIndex: "executionTime",
      key: "executionTime",
      width: "14%",
      align: "right",
      render: (time) => (time !== null ? time : "—"),
    },
  ];

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
        </CapRow>

        <CapTable
          className="audit-table"
          columns={columns}
          dataSource={filteredData}
        />
      </CapColumn>
    </CapRow>
  );
};

export default withRouter(injectIntl(withStyles(DBAuditLog, styles)));
