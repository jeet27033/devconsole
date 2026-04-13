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
} = styledVars;

export default css`
  &.log-viewer {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
  }

  .log-viewer-form {
    display: flex;
    gap: ${CAP_SPACE_16};
    align-items: flex-end;
    flex-wrap: wrap;
    margin-bottom: ${CAP_SPACE_16};
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
  }

  .form-field label {
    font-size: ${FONT_SIZE_S};
    font-weight: 500;
    color: ${FONT_COLOR_02};
  }

  .form-field .extension-select {
    min-width: 12rem;
  }

  .form-field .limit-input {
    width: 8rem;
  }

  .search-section {
    margin-bottom: ${CAP_SPACE_16};
  }

  .search-section-label {
    font-size: ${FONT_SIZE_S};
    font-weight: 500;
    color: ${FONT_COLOR_02};
    margin-bottom: ${CAP_SPACE_08};
  }

  .search-terms-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${CAP_SPACE_08};
  }

  @media (max-width: 1200px) {
    .search-terms-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .search-terms-grid {
      grid-template-columns: 1fr;
    }
  }

  .search-term-row {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_04};
  }

  .search-term-row .ant-input {
    flex: 1;
  }

  .search-term-row .operator-select {
    width: 7rem !important;
  }

  .search-hint {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    margin-top: ${CAP_SPACE_08};
  }

  .search-actions {
    display: flex;
    gap: ${CAP_SPACE_08};
    margin-top: ${CAP_SPACE_08};
  }

  .logs-container {
    display: flex;
    gap: ${CAP_SPACE_08};
    margin-top: ${CAP_SPACE_16};
  }

  .logs-main {
    flex: 1;
    max-height: 80vh;
    overflow: auto;
    background: ${CAP_WHITE};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
  }

  .time-chunks-sidebar {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
    max-height: 80vh;
    overflow-y: auto;
    width: 8.75rem;
  }

  .time-chunk-btn {
    text-align: left;
    padding: ${CAP_SPACE_04} ${CAP_SPACE_08};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.25rem;
    background: ${CAP_WHITE};
    cursor: pointer;
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_01};
    transition: background-color 0.15s;
  }

  .time-chunk-btn:hover {
    background: ${CAP_G09};
  }

  .time-chunk-btn.active {
    background: ${CAP_G09};
    font-weight: 600;
    border-color: ${FONT_COLOR_01};
  }

  .time-chunk-btn.empty {
    opacity: 0.5;
    font-style: italic;
  }

  .chunk-nav {
    display: flex;
    gap: ${CAP_SPACE_04};
    margin-top: ${CAP_SPACE_08};
  }

  .current-chunk-label {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    font-weight: 600;
    background: ${CAP_G09};
    border-bottom: 0.0625rem solid ${CAP_G20};
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
  }

  .log-entry {
    border-left: 0.25rem solid;
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    transition: background-color 0.15s;
    cursor: pointer;
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .log-entry:nth-child(odd) {
    border-left-color: #90ee90;
  }

  .log-entry:nth-child(even) {
    border-left-color: #add8e6;
  }

  .log-entry:hover {
    background: ${CAP_G09};
  }

  .log-summary {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
  }

  .log-detail {
    margin-top: ${CAP_SPACE_08};
    padding: ${CAP_SPACE_08};
    background: ${CAP_G09};
    border-radius: 0.25rem;
    border: 0.0625rem solid ${CAP_G20};
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: ${FONT_SIZE_S};
    font-family: monospace;
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
