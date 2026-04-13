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
  &.platform-metrics {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
  }

  .control-panel {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    margin-bottom: ${CAP_SPACE_16};
  }

  .control-panel .duration-select,
  .control-panel.reloadMatrix,
  .control-panel .product-select,
  .control-panel .dashboard-select {
    min-width: 12rem;
  }

  .reloadMatrix {
    cursor: pointer;
    margin-right: ${CAP_SPACE_08};
    padding: ${CAP_SPACE_04};
    border-radius: 0.25rem;
    color: ${FONT_COLOR_02};
    transition: color 0.2s, background-color 0.2s, transform 0.3s;
  }

  .reloadMatrix:hover {
    color: ${FONT_COLOR_01};
    background: ${CAP_G09};
    transform: rotate(90deg);
  }

  .reloadMatrix:active {
    transform: rotate(360deg);
  }

  .dashboard-tabs {
    display: flex;
    gap: 0.0625rem;
    border-bottom: 0.0625rem solid ${CAP_G20};
    margin-bottom: ${CAP_SPACE_16};
    overflow-x: auto;
  }

  .dashboard-tab {
    padding: ${CAP_SPACE_04} ${CAP_SPACE_16};
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    border-radius: 0.25rem 0.25rem 0 0;
    transition: background-color 0.15s, color 0.15s;
    white-space: nowrap;
  }

  .dashboard-tab:hover {
    color: ${FONT_COLOR_01};
  }

  .dashboard-tab.active {
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_01};
    border-bottom: 0.125rem solid ${FONT_COLOR_01};
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: ${CAP_SPACE_08};
  }

  @media (max-width: 1200px) {
    .dashboard-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  .chart-card {
    background: ${CAP_WHITE};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
    overflow: hidden;
    grid-column: span 2;
  }

  .chart-card.scaler {
    grid-column: span 2;
  }

  .chart-card.wide {
    grid-column: span 3;
  }

  .chart-card.full-width {
    grid-column: 1 / -1;
  }

  .chart-header {
    padding: ${CAP_SPACE_04} ${CAP_SPACE_12};
    border-bottom: 0.0625rem solid ${CAP_G20};
    font-size: ${FONT_SIZE_S};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_02};
    background: ${CAP_G09};
  }

  .chart-body {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart-body.scaler-body {
    padding: ${CAP_SPACE_12};
    min-height: auto;
  }

  .chart-body.line-body {
    min-height: 14rem;
  }

  .chart-body.table-body {
    padding: 0;
    min-height: auto;
  }

  .scaler-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${FONT_COLOR_01};
    text-align: center;
  }

  .scaler-unit {
    font-size: 0.75rem;
    font-weight: 400;
    color: ${FONT_COLOR_02};
    margin-left: ${CAP_SPACE_04};
  }

  .metrics-table {
    width: 100%;
    border-collapse: collapse;
  }

  .metrics-table th {
    background: ${CAP_G09};
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    text-align: left;
    font-size: ${FONT_SIZE_S};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_02};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .metrics-table td {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .metrics-table tr:hover td {
    background: ${CAP_G09};
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 18.75rem;
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_M};
  }

  .filter-container {
    margin-bottom: ${CAP_SPACE_16};
  }
`;
