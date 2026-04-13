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
  &.bugsnag-config {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
  }

  /* Toolbar */
  .toolbar-row {
    display: flex;
    align-items: center;
    margin-bottom: ${CAP_SPACE_16};
  }

  .app-select {
    min-width: 14rem;
  }

  /* Config card */
  .config-card {
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.5rem;
    padding: ${CAP_SPACE_24};
  }

  /* Section headings */
  .section-title {
    margin-bottom: ${CAP_SPACE_16};
    color: ${FONT_COLOR_01};
    font-weight: ${FONT_WEIGHT_MEDIUM};
  }

  .section-divider {
    border: none;
    border-top: 0.0625rem solid ${CAP_G20};
    margin: ${CAP_SPACE_24} 0;
  }

  /* Stability targets */
  .stability-section {
    padding: ${CAP_SPACE_16};
    background: ${CAP_G09};
    border-radius: 0.375rem;
    border: 0.0625rem solid ${CAP_G20};
    max-width: 32rem;
  }

  .stability-row {
    display: flex;
    align-items: center;
    margin-bottom: ${CAP_SPACE_12};
    gap: ${CAP_SPACE_12};
  }

  .stability-row:last-child {
    margin-bottom: 0;
  }

  .stability-label {
    width: 10rem;
    font-weight: 500;
    color: ${FONT_COLOR_01};
    font-size: ${FONT_SIZE_M};
  }

  .stability-input {
    width: 10rem;
  }

  .stability-input input {
    text-align: center;
    font-weight: ${FONT_WEIGHT_MEDIUM};
  }

  /* Notification form */
  .notification-form {
    padding-left: ${CAP_SPACE_04};
  }

  .form-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: ${CAP_SPACE_12};
    gap: ${CAP_SPACE_16};
  }

  .form-label {
    width: 12rem;
    font-weight: 500;
    color: ${FONT_COLOR_01};
    font-size: ${FONT_SIZE_M};
    padding-top: ${CAP_SPACE_08};
    flex-shrink: 0;
  }

  .form-input {
    flex: 1;
    max-width: 22rem;
  }

  .form-input .ant-input,
  .form-input .ant-select {
    width: 100%;
  }

  .form-input textarea {
    resize: none;
  }

  .channel-select {
    width: 100% !important;
  }

  /* Config accordion */
  .config-section {
    padding-left: ${CAP_SPACE_04};
  }

  .config-accordion.ant-collapse {
    background: transparent;
    border: none;
  }

  .config-accordion {
    .ant-collapse-item {
      margin-bottom: ${CAP_SPACE_08};
      background-color: ${CAP_G09};
      border: 0.0625rem solid ${CAP_G20};
      border-radius: 0.375rem !important;
      overflow: hidden;
    }

    .ant-collapse-header {
      padding: ${CAP_SPACE_12} ${CAP_SPACE_16} !important;
    }

    .ant-collapse-content {
      border-top: 0.0625rem solid ${CAP_G20};
    }

    .ant-collapse-content-box {
      padding: ${CAP_SPACE_16};
      background: ${CAP_WHITE};
    }
  }

  .accordion-header-row {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    font-size: ${FONT_SIZE_M};
    font-weight: 500;
    color: ${FONT_COLOR_01};
  }

  /* Filter sections inside accordion */
  .filter-group-title {
    font-size: ${FONT_SIZE_S};
    font-weight: 600;
    color: ${FONT_COLOR_02};
    text-transform: uppercase;
    letter-spacing: 0.03rem;
    margin-bottom: ${CAP_SPACE_08};
    margin-top: ${CAP_SPACE_16};
  }

  .filter-group-title:first-child {
    margin-top: 0;
  }

  .checkbox-row,
  .radio-row {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_16};
    margin-bottom: ${CAP_SPACE_04};
    padding: ${CAP_SPACE_04} 0;
  }

  .checkbox-item,
  .radio-item {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_04};
    cursor: pointer;
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    padding: ${CAP_SPACE_04} ${CAP_SPACE_08};
    border-radius: 0.25rem;
    transition: background-color 0.15s ease;
  }

  .checkbox-item:hover,
  .radio-item:hover {
    background-color: ${CAP_G09};
  }

  .checkbox-item input,
  .radio-item input {
    accent-color: ${CAP_SECONDARY.base};
    cursor: pointer;
    width: 1rem;
    height: 1rem;
  }

  /* Frequency extra fields */
  .frequency-fields {
    margin-top: ${CAP_SPACE_16};
    padding-top: ${CAP_SPACE_12};
    border-top: 0.0625rem solid ${CAP_G20};
  }

  .frequency-row {
    display: flex;
    align-items: center;
    margin-bottom: ${CAP_SPACE_08};
    gap: ${CAP_SPACE_08};
  }

  .frequency-label {
    width: 6rem;
    font-size: ${FONT_SIZE_M};
    font-weight: 500;
    color: ${FONT_COLOR_01};
  }

  .frequency-input {
    width: 6rem;
  }

  .period-unit-select {
    width: 8rem !important;
  }

  /* Save button */
  .save-button {
    margin-top: ${CAP_SPACE_24};
  }
`;
