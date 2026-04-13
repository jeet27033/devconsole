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
  &.newrelic-configurations {
    padding: ${CAP_SPACE_24} ${CAP_SPACE_16};
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
    width: 16rem;
  }

  .filters-section .filter-select {
    min-width: 7rem;
  }

  .filters-section .platform-select {
    min-width: 11rem;
  }

  .filters-right {
    margin-left: auto;
    display: flex;
    gap: ${CAP_SPACE_08};
    align-items: center;
  }

  .settings-btn {
    display: flex;
    border: 0.0625rem solid ${CAP_G20};
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 0.25rem;
    align-items: center;
    justify-content: center;
    background: ${CAP_WHITE};
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .settings-btn:hover {
    background: ${CAP_G09};
  }

  .conditions-table-container {
    width: 100%;
    overflow-x: auto;
  }

  .conditions-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .conditions-table thead {
    background: #fafbfc;
  }

  .conditions-table th {
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

  .conditions-table th .sub-header {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    margin-top: ${CAP_SPACE_04};
  }

  .conditions-table td {
    padding: ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .conditions-table tr:hover td {
    background: #f9fafb;
  }

  .condition-name-cell {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
  }

  .condition-status {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
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

  .status-dot.disabled {
    background: #6c757d;
  }

  .threshold-cell {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
  }

  .threshold-badge {
    font-size: ${FONT_SIZE_S};
    font-weight: 550;
  }

  .threshold-badge.critical {
    color: #EA213A;
  }

  .threshold-badge.warning {
    color: #F87D23;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: ${CAP_SPACE_04} ${CAP_SPACE_08};
    color: ${FONT_COLOR_02};
    border-radius: 0.25rem;
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
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    transition: background-color 0.15s;
  }

  .action-menu-item:hover {
    background: ${CAP_G09};
  }

  .action-menu-item.danger {
    color: #DC2626;
  }

  .action-menu-item.danger:hover {
    background: #fee2e2;
  }

  /* Side Panel */
  .side-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
  }

  .side-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 60rem;
    max-width: 90%;
    height: 100vh;
    background: ${CAP_WHITE};
    box-shadow: -0.125rem 0 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 1050;
    display: flex;
    flex-direction: column;
  }

  .side-panel-header {
    padding: 1.625rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .side-panel-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_01};
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: ${FONT_COLOR_02};
    cursor: pointer;
    padding: ${CAP_SPACE_04};
  }

  .close-btn:hover {
    color: ${FONT_COLOR_01};
  }

  .side-panel-body {
    padding: ${CAP_SPACE_24} 3rem;
    flex: 1;
    overflow-y: auto;
  }

  .side-panel-footer {
    padding: ${CAP_SPACE_24} 3rem;
    border-top: 0.0625rem solid ${CAP_G20};
    display: flex;
    gap: ${CAP_SPACE_08};
  }

  .form-step {
    margin-bottom: ${CAP_SPACE_24};
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_12};
    margin-bottom: ${CAP_SPACE_16};
  }

  .step-number {
    width: 1.75rem;
    height: 1.75rem;
    background: ${CAP_G09};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${FONT_SIZE_S};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_01};
    flex-shrink: 0;
  }

  .step-title {
    font-size: ${FONT_SIZE_M};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_01};
  }

  .step-content {
    padding-left: 2.75rem;
  }

  .form-field {
    margin-bottom: ${CAP_SPACE_12};
  }

  .form-field label {
    display: block;
    font-size: ${FONT_SIZE_S};
    font-weight: 500;
    color: ${FONT_COLOR_01};
    margin-bottom: ${CAP_SPACE_04};
  }

  .threshold-card {
    background: ${CAP_G09};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
    padding: ${CAP_SPACE_12};
    margin-bottom: ${CAP_SPACE_08};
  }

  .threshold-row {
    display: flex;
    gap: ${CAP_SPACE_08};
    align-items: center;
    flex-wrap: wrap;
  }

  .threshold-row .ant-select,
  .threshold-row .ant-input {
    flex: 1;
    min-width: 6rem;
  }

  .notification-section {
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
    padding: ${CAP_SPACE_16};
    background: ${CAP_G09};
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
