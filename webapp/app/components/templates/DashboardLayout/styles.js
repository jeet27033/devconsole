import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_24,
  CAP_SPACE_32,
  CAP_WHITE,
} = styledVars;

export default css`
  &.ant-row {
    display: flex;
    flex-wrap: nowrap;
    min-height: 100vh;
  }

  .sidebar-column {
    min-height: 100vh;
    flex-shrink: 0;
    align-self: stretch;
  }

  .content-column {
    flex: 1;
    min-height: 100vh;
    background-color: ${CAP_WHITE};
    padding: ${CAP_SPACE_32} ${CAP_SPACE_24};
  }
`;
