import { createGlobalStyle } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_04,
  CAP_SPACE_08,
  CAP_SPACE_12,
  CAP_SPACE_16,
  CAP_SPACE_20,
  CAP_SPACE_24,
  CAP_G06,
  CAP_G08,
  CAP_G09,
  CAP_WHITE,
  FONT_COLOR_01,
  FONT_COLOR_02,
  FONT_SIZE_S,
  FONT_SIZE_M,
} = styledVars;

export const CustomModalGlobalStyles = createGlobalStyle`
  .custom-modal-wrap .ant-modal.cap-modal-v2 {
    max-width: none;
  }

  /* Deploy Modal body padding */
  .custom-modal-wrap .ant-modal.cap-modal-v2 .ant-modal-body {
    padding: ${CAP_SPACE_20} ${CAP_SPACE_24};
  }

  /* Deploy Modal form */
  .custom-modal-wrap .deployModalFormItem {
    margin-bottom: ${CAP_SPACE_20};
  }

  .custom-modal-wrap .deployModalFormLabel {
    margin-bottom: ${CAP_SPACE_08};
  }

  .custom-modal-wrap .deployModalSwitchRow {
    gap: ${CAP_SPACE_12};
    margin: ${CAP_SPACE_08} 0 ${CAP_SPACE_12} 0;
  }

  .custom-modal-wrap .logsModalContent {
    margin-bottom: ${CAP_SPACE_08};
  }

  /* Logs Modal detail table */
  .custom-modal-wrap .logsDetailPane {
    padding: ${CAP_SPACE_16};
  }

  .custom-modal-wrap .logsModalDetailRow {
    border-bottom: 0.0625rem solid ${CAP_G08};
    padding: ${CAP_SPACE_08} 0;
  }

  .custom-modal-wrap .logsModalDetailRow:last-child {
    border-bottom: none;
  }

  .custom-modal-wrap .logsModalDetailLabel {
    font-weight: 600;
    color: ${FONT_COLOR_01};
    font-size: ${FONT_SIZE_S};
  }

  .custom-modal-wrap .logsModalDetailValue {
    color: ${FONT_COLOR_02};
    font-size: ${FONT_SIZE_S};
    word-break: break-word;
  }

  /* Logs Modal console pane */
  .custom-modal-wrap .logsConsolePane {
    border-radius: ${CAP_SPACE_04};
    overflow: hidden;
    border: 0.0625rem solid ${CAP_G08};
  }

  .custom-modal-wrap .logsConsolePane .react-lazylog {
    background: #1e1e1e;
    font-size: ${FONT_SIZE_S};
  }
`;
