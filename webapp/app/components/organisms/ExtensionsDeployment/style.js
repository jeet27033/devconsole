import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_16,
  CAP_G09,
  CAP_WHITE,
  FONT_COLOR_01,
  FONT_COLOR_02,
} = styledVars;

export default css`
  .topBarRow {
    margin-bottom: ${CAP_SPACE_16};
  }
  
  .searchInput {
    max-width: 25rem;
  }

  .ant-table {
    color: ${FONT_COLOR_01};
    background: ${CAP_WHITE};
  }

  .ant-table-thead > tr > th {
    color: ${FONT_COLOR_01};
    font-weight: 600;
    background: ${CAP_G09};
    padding: 0.5rem 0.75rem;
  }

  .ant-table-tbody > tr > td {
    color: ${FONT_COLOR_02};
    background: ${CAP_WHITE};
    padding: 0.5rem 0.75rem;
  }

  .ant-table-tbody > tr:hover > td {
    background: ${CAP_WHITE} !important;
  }

  .viewLogsLink {
    padding: 0;
  }
`;
