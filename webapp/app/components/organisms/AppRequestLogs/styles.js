import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_04,
  CAP_SPACE_08,
  CAP_SPACE_12,
  CAP_SPACE_16,
  CAP_SPACE_24,
  CAP_G09,
  CAP_G20,
  CAP_WHITE,
  CAP_SECONDARY,
  FONT_COLOR_01,
  FONT_COLOR_02,
  FONT_SIZE_S,
  FONT_SIZE_M,
  FONT_WEIGHT_MEDIUM,
} = styledVars;

export default css`
  &.app-request-logs {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
  }

  .control-panel {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    margin-bottom: ${CAP_SPACE_16};
  }

  .control-panel .app-select {
    min-width: 20rem;
  }

  .filter-section {
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
    margin-bottom: ${CAP_SPACE_16};
    overflow: hidden;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    background: ${CAP_G09};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .filter-header-title {
    font-size: ${FONT_SIZE_M};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_01};
  }

  .filter-toggle {
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${CAP_SECONDARY.base || '#1890ff'};
    font-size: ${FONT_SIZE_S};
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_04};
  }

  .filter-body {
    padding: ${CAP_SPACE_12};
  }

  .field-selector-row {
    display: flex;
    gap: ${CAP_SPACE_08};
    align-items: center;
    margin-bottom: ${CAP_SPACE_12};
  }

  .field-selector-row .field-dropdown {
    min-width: 16rem;
  }

  .selected-fields {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_08};
  }

  .filter-field {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    padding: ${CAP_SPACE_08};
    background: ${CAP_WHITE};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.25rem;
  }

  .filter-field-label {
    width: 10rem;
    font-size: ${FONT_SIZE_M};
    font-weight: 500;
    color: ${FONT_COLOR_01};
    flex-shrink: 0;
  }

  .filter-field .search-type-group {
    display: flex;
    gap: ${CAP_SPACE_12};
    flex-shrink: 0;
  }

  .filter-field .search-type-group label {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_04};
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_01};
    cursor: pointer;
  }

  .filter-field .filter-input {
    flex: 1;
  }

  .filter-placeholder {
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_S};
    padding: ${CAP_SPACE_08};
  }

  .results-area {
    margin-top: ${CAP_SPACE_16};
  }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .results-table th {
    background: ${CAP_G09};
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    text-align: left;
    font-size: ${FONT_SIZE_S};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_02};
    border-bottom: 0.0625rem solid ${CAP_G20};
    position: sticky;
    top: 0;
  }

  .results-table td {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .results-table tr:hover td {
    background: ${CAP_G09};
  }

  .results-table .request-id-cell {
    background: #e6f7ff;
  }

  .results-table .request-id-link {
    color: ${CAP_SECONDARY.base || '#1890ff'};
    cursor: pointer;
    text-decoration: none;
  }

  .results-table .request-id-link:hover {
    text-decoration: underline;
  }

  .results-count {
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    margin-bottom: ${CAP_SPACE_08};
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 12.5rem;
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_M};
  }
`;
