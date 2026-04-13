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
  &.config-management {
    padding: ${CAP_SPACE_12} ${CAP_SPACE_24};
  }

  .toolbar-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${CAP_SPACE_16};
  }

  .toolbar-actions {
    display: flex;
    gap: ${CAP_SPACE_08};
  }

  .config-table-container {
    max-height: max-content;
    overflow-y: auto;
    border: 0.0625rem solid ${CAP_G20};
    border-radius: 0.375rem;
  }

  .config-table {
    width: 100%;
    border-collapse: collapse;
  }

  .config-table th {
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

  .config-table td {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    border-bottom: 0.0625rem solid ${CAP_G20};
  }

  .config-table tr:hover td {
    background: ${CAP_G09};
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

  .switch-field {
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
  }

  .switch-field label {
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    cursor: pointer;
  }

  .requests-table-container {
    max-height: 31.25rem;
    overflow-y: auto;
  }

  .requests-warning {
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_S};
    margin-bottom: ${CAP_SPACE_12};
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
