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
  &.b2c-gateway-config {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
  }

  .section {
    margin-bottom: ${CAP_SPACE_24};
  }

  .section-divider {
    margin-top: 2.5rem;
    padding-top: 1.25rem;
    border-top: 0.125rem solid ${CAP_G20};
  }

  .section-title {
    margin-bottom: ${CAP_SPACE_16};
  }

  .toolbar-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${CAP_SPACE_12};
  }

  .toolbar-actions {
    display: flex;
    gap: ${CAP_SPACE_08};
  }

  .table-container {
    max-height: 25rem;
    overflow-y: auto;
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    background: ${CAP_G09};
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    text-align: left;
    font-size: ${FONT_SIZE_S};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${FONT_COLOR_02};
    border-bottom: 0.0625rem solid ${CAP_G20};
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .data-table td {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .data-table tr:hover td {
    background: ${CAP_G09};
  }

  .info-banner {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    background: #e6f7ff;
    border: 0.0625rem solid #91d5ff;
    border-radius: 0.25rem;
    color: ${FONT_COLOR_01};
    font-size: ${FONT_SIZE_M};
    margin-bottom: ${CAP_SPACE_12};
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_12};
  }

  .modal-form-field {
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_04};
  }

  .modal-form-field label {
    font-size: ${FONT_SIZE_M};
    font-weight: 500;
    color: ${FONT_COLOR_01};
  }

  .modal-form-field .help-text {
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
    margin-top: ${CAP_SPACE_04};
  }

  .requests-table-container {
    max-height: 31.25rem;
    overflow-y: auto;
  }

  .doc-footer {
    margin-top: 2.5rem;
    padding: 0.75rem 0;
    border-top: 0.0625rem solid ${CAP_G20};
    text-align: center;
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_02};
  }

  .doc-footer a {
    color: #1890ff;
    text-decoration: none;
  }

  .doc-footer a:hover {
    text-decoration: underline;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 6.25rem;
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_M};
  }
`;
