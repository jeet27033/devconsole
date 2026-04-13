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
  FONT_COLOR_01,
  FONT_COLOR_02,
  FONT_SIZE_S,
  FONT_SIZE_M,
  FONT_WEIGHT_MEDIUM,
} = styledVars;

export default css`
  &.newrelic-issues {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
    background: ${CAP_WHITE};
    min-height: calc(100vh - 3rem);
    border-radius: 0.375rem;
  }

  .filters-section {
    display: flex;
    flex-wrap: wrap;
    gap: ${CAP_SPACE_12};
    align-items: center;
    margin-bottom: ${CAP_SPACE_16};
  }

  .filters-section .search-input {
    width: 20rem;
  }

  .filters-section .filter-select {
    min-width: 6rem;
  }

  .filters-section .platform-select {
    min-width: 11rem;
  }

  .issues-table-container {
    width: 100%;
    overflow-x: auto;
    border-radius: 0.25rem;
  }

  .issues-table {
    width: 100%;
    border-collapse: collapse;
  }

  .issues-table thead {
    background: #fafbfc;
  }

  .issues-table th {
    padding: ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_S};
    font-weight: 400;
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fafbfc;
  }

  .issues-table th .sub-header {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    font-weight: 400;
    margin-top: ${CAP_SPACE_04};
  }

  .issues-table td {
    padding: ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
    vertical-align: middle;
  }

  .issues-table tr:hover td {
    background: #f9fafb;
  }

  .issues-table .closed-row td {
    color: ${FONT_COLOR_02};
  }

  .status-cell {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
  }

  .status-label {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
  }

  .status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
  }

  .status-dot.active {
    background: #67b46a;
  }

  .status-dot.closed {
    background: #6c757d;
  }

  .action-taken-by {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
  }

  .priority-badge {
    font-weight: 550;
    padding: 0 ${CAP_SPACE_08};
    border-radius: 0.25rem;
  }

  .priority-Critical {
    color: #EA213A;
  }

  .priority-High {
    color: #F87D23;
  }

  .priority-Medium {
    color: #FFC107;
  }

  .priority-Low {
    color: #6c757d;
  }

  .condition-cell {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
  }

  .condition-name {
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .condition-platform {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: ${CAP_SPACE_04} ${CAP_SPACE_08};
    color: ${FONT_COLOR_02};
    border-radius: 0.25rem;
    transition: background-color 0.15s;
  }

  .action-btn:hover {
    background: ${CAP_G09};
    color: ${FONT_COLOR_01};
  }

  .action-menu {
    position: absolute;
    right: 0;
    top: 100%;
    background: ${CAP_WHITE};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
    min-width: 12.5rem;
    box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .action-menu-item {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    padding: ${CAP_SPACE_08} ${CAP_SPACE_16};
    color: ${FONT_COLOR_01};
    cursor: pointer;
    font-size: ${FONT_SIZE_M};
    transition: background-color 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }

  .action-menu-item:hover {
    background: ${CAP_G09};
  }

  .action-menu-item.close-action {
    color: #5CB85C;
  }

  .action-menu-item.close-action:hover {
    background: #dfffdf;
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
