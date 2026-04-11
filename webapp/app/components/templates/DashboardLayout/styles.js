import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_20,
  CAP_SPACE_24,
  CAP_SPACE_32,
  BG_01,
} = styledVars;

export default css`
  &.ant-row {
    display: flex;
    flex-wrap: nowrap;
    min-height: 100vh;
  }

  .sidebar-column {
    min-height: 100vh;
    height: 100%;
    flex-shrink: 0;
  }

  .content-column {
    flex: 1;
    min-height: 100vh;
    background-color: ${BG_01};
    padding: ${CAP_SPACE_32} ${CAP_SPACE_24};
  }
`;
