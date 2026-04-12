import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_04,
  CAP_SPACE_08,
  CAP_SPACE_12,
  CAP_SPACE_16,
  CAP_SPACE_20,
  CAP_SPACE_24,
  CAP_WHITE,
  CAP_G01,
  CAP_G09,
  CAP_G20,
  CAP_SECONDARY,
  FONT_COLOR_01,
  FONT_COLOR_02,
  FONT_SIZE_S,
  FONT_SIZE_M,
} = styledVars;

export default css`
  &.mongodb-workbench {
    padding: ${CAP_SPACE_24};
  }

  .syntax-alert {
    background: #e8f4fd;
    border: 0.0625rem solid ${CAP_SECONDARY.base};
    border-radius: 0.25rem;
    padding: ${CAP_SPACE_16};
    margin-bottom: ${CAP_SPACE_20};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .syntax-alert-text {
    color: ${FONT_COLOR_01};
    font-size: ${FONT_SIZE_S};
    line-height: 1.5;
  }

  .syntax-alert-text strong {
    font-weight: 600;
  }

  .syntax-alert-text a {
    color: ${CAP_SECONDARY.base};
    text-decoration: underline;
    font-weight: 500;
  }

  .syntax-alert-close {
    cursor: pointer;
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_M};
    background: none;
    border: none;
    padding: 0;
    line-height: 1;
  }

  .query-form-container {
    background: ${CAP_WHITE};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.25rem;
    padding: ${CAP_SPACE_24};
    margin-bottom: ${CAP_SPACE_20};
  }

  .form-field {
    margin-bottom: ${CAP_SPACE_16};
  }

  .form-label {
    margin-bottom: ${CAP_SPACE_08};
  }

  .db-select,
  .coll-select {
    width: 100%;
  }

  .query-textarea textarea {
    width: 100%;
    min-height: 7.5rem;
    font-family: 'Courier New', Courier, monospace;
    font-size: ${FONT_SIZE_S};
    resize: vertical;
  }

  .action-buttons {
    gap: ${CAP_SPACE_12};
  }

  .query-tabs-row {
    margin-bottom: ${CAP_SPACE_16};
  }

  .query-tab {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_16};
    border: 0.0625rem solid ${CAP_G20};
    border-bottom: none;
    border-radius: 0.25rem 0.25rem 0 0;
    background: ${CAP_G09};
    cursor: pointer;
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    margin-right: ${CAP_SPACE_04};
  }

  .query-tab.active {
    background: ${CAP_WHITE};
    color: ${CAP_SECONDARY.base};
    font-weight: 600;
    border-bottom: 0.125rem solid ${CAP_SECONDARY.base};
  }

  .query-tab-close {
    margin-left: ${CAP_SPACE_08};
    cursor: pointer;
    font-weight: 600;
  }

  .response-container {
    background: ${CAP_WHITE};
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.25rem;
    padding: ${CAP_SPACE_24};
  }

  .response-header {
    margin-bottom: ${CAP_SPACE_12};
  }

  .execution-time {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    font-weight: 400;
  }

  .response-viewer {
    height: 25rem;
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .response-viewer .react-lazylog {
    background: #1e1e1e;
    font-size: ${FONT_SIZE_S};
  }

  .empty-response {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25rem;
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_S};
    background: ${CAP_G09};
    border-radius: 0.25rem;
  }

  .loader-icon {
    margin-left: ${CAP_SPACE_12};
    font-size: 1.375rem;
    color: ${CAP_SECONDARY.base};
    display: flex;
    align-items: center;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spinner {
    animation: spin 1s linear infinite;
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    border: 0.1875rem solid ${CAP_G20};
    border-top-color: ${CAP_SECONDARY.base};
    border-radius: 50%;
  }
`;
