import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
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
`;
