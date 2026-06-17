import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_04,
  CAP_SPACE_08,
  CAP_SPACE_12,
  CAP_SPACE_16,
  CAP_SPACE_24,
  CAP_WHITE,
  CAP_G09,
  CAP_G20,
  FONT_COLOR_01,
  FONT_COLOR_02,
  FONT_SIZE_S,
} = styledVars;

export default css`
  &.db-audit-log {
    padding: ${CAP_SPACE_24};
  }

  .filter-bar {
    margin-bottom: ${CAP_SPACE_16};
    gap: ${CAP_SPACE_12};
  }

  .search-input {
    max-width: 20rem;
  }

  .status-filter {
    width: 14rem;
  }

  .audit-table .ant-table {
    color: ${FONT_COLOR_01};
    background: ${CAP_WHITE};
  }

  .audit-table .ant-table-thead > tr > th {
    color: ${FONT_COLOR_01};
    font-weight: 600;
    background: ${CAP_G09};
  }

  .audit-table .ant-table-tbody > tr > td {
    color: ${FONT_COLOR_02};
    background: ${CAP_WHITE};
    padding: 0.5rem 0.5rem;
    font-size: ${FONT_SIZE_S};
    white-space: nowrap;
  }

  .audit-table .ant-table-thead > tr > th {
    padding: 0.5rem 0.5rem;
  }

  .audit-table .ant-table-tbody > tr:hover > td {
    background: ${CAP_G09} !important;
  }

  .status-badge {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border-radius: 0.75rem;
    font-size: ${FONT_SIZE_S};
    font-weight: 500;
    text-transform: capitalize;
  }

  .status-success {
    background: #e6f7e9;
    color: #2e7d32;
  }

  .status-failed {
    background: #ffeaea;
    color: #c62828;
  }

  .status-pending_approval {
    background: #fff3e0;
    color: #e65100;
  }

  .status-rejected {
    background: ${CAP_G09};
    color: ${FONT_COLOR_02};
  }

  .query-cell {
    display: block;
    max-width: 18rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: ${FONT_SIZE_S};
  }

  .audit-table .ant-table-tbody > tr {
    cursor: pointer;
  }

  /* ── Query Detail Modal ── */

  .detail-status-row {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_12};
    padding: ${CAP_SPACE_12} ${CAP_SPACE_16};
    background: ${CAP_G09};
    border-radius: 0.375rem;
    margin-bottom: ${CAP_SPACE_16};
  }

  .detail-id-label {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
  }

  .detail-id-value {
    font-size: 1rem;
    font-weight: 700;
    color: ${FONT_COLOR_01};
  }

  .detail-section-title {
    font-size: 0.6875rem;
    font-weight: 700;
    color: ${FONT_COLOR_02};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: ${CAP_SPACE_16} 0 ${CAP_SPACE_08};
    padding-bottom: ${CAP_SPACE_04};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .detail-query-block {
    background: #1a1a2e;
    color: #e2e8f0;
    padding: ${CAP_SPACE_12} ${CAP_SPACE_16};
    border-radius: 0.375rem;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 10rem;
    overflow-y: auto;
    border: 0.0625rem solid #2d3748;
    margin-bottom: ${CAP_SPACE_16};
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${CAP_SPACE_12} ${CAP_SPACE_24};
    margin-bottom: ${CAP_SPACE_08};
  }

  .detail-field {
    display: flex;
    flex-direction: column;
    gap: 0.1875rem;
  }

  .detail-label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: ${FONT_COLOR_02};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .detail-value {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_01};
    font-weight: 500;
    word-break: break-word;
  }
`;
