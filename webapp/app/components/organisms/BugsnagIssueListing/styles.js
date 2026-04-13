import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_08,
  CAP_SPACE_16,
  CAP_SPACE_24,
  CAP_G20,
  FONT_COLOR_01,
  FONT_SIZE_S,
  FONT_SIZE_M,
  FONT_COLOR_02,
  CAP_WHITE
} = styledVars;

export default css`
  .bugsnag-issue-listing {
    padding: ${CAP_SPACE_24};
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_16};
    margin-bottom: ${CAP_SPACE_24};
  }

  .toolbar-row > * {
    float: left;
  }

  .app-select {
    min-width: 12rem;
  }

  .severity-badge {
    display: inline-block;
    padding: 0.125rem ${CAP_SPACE_08};
    border-radius: 0.25rem;
    font-size: ${FONT_SIZE_S};
    font-weight: 600;
    text-transform: capitalize;
  }

  .severity-error {
    background: #fde8e8;
    color: #c0392b;
  }

  .severity-warning {
    background: #fef3e2;
    color: #e67e22;
  }

  .severity-info {
    background: #e8f4fd;
    color: #2980b9;
  }

  .details-cell {
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    max-width: 30rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .issue-table {
    .ant-table-thead > tr > th {
      background: ${CAP_G20};
      font-weight: 600;
    }
    .ant-table-tbody > tr > td {
      color: ${FONT_COLOR_02};
      background: ${CAP_WHITE};
      padding: 0.5rem 0.75rem;
      cursor: pointer;
    }
  }
`;
