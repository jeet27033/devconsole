import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_G01,
  CAP_G20,
  CAP_WHITE,
  CAP_SECONDARY,
  BG_01,
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_M,
  FONT_SIZE_S,
} = styledVars;

const BASE_PADDING = 1.857;
const INDENT_STEP = 1.143;
const MAX_DEPTH = 5;

const depthPaddingRules = Array.from({ length: MAX_DEPTH }, (_, depth) => {
  const padding = BASE_PADDING + depth * INDENT_STEP;
  return `.sidebar-item.depth-${depth} { padding-left: ${padding}rem; }`;
}).join('\n');

export default css`
  &.custom-sidebar-wrapper {
    min-height: 100vh;
    height: 100%;
    background-color: ${CAP_WHITE};
    border-right: 0.0625rem solid ${CAP_G20};
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 1.857rem;
  }

  .sidebar-nav {
    text-align: left;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    height: 2.571rem;
    padding-right: 1rem;
    cursor: pointer;
    font-size: ${FONT_SIZE_S};
    color: ${CAP_G01};
    transition: background-color 0.15s ease;
    user-select: none;
  }

  .sidebar-item:hover {
    background-color: ${BG_01};
    color: ${CAP_SECONDARY.base};
  }

  .sidebar-item.has-children {
    height: 2.857rem;
    font-weight: ${FONT_WEIGHT_MEDIUM};
  }

  .sidebar-item.depth-0 {
    font-size: ${FONT_SIZE_M};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    height: 2.857rem;
  }

  .sidebar-item.active {
    background-color: rgba(36, 102, 234, 0.08);
    color: ${CAP_SECONDARY.base};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    border-left: 0.214rem solid ${CAP_SECONDARY.base};
  }

  .sidebar-item-text {
    flex: 1;
  }

  .sidebar-arrow {
    flex-shrink: 0;
    color: ${CAP_G01};
  }

  .sidebar-children {
    /* no extra styling needed, depth padding handles indent */
  }

  ${depthPaddingRules}
`;
