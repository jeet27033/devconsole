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
  return `
    .sidebar-nav .ant-menu-submenu.depth-${depth} > .ant-menu-submenu-title {
      padding-left: ${padding}rem !important;
    }
    .sidebar-nav .ant-menu-item.depth-${depth} {
      padding-left: ${padding}rem !important;
    }
  `;
}).join('');

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

  /* menu base */
  .sidebar-nav.cap-menu-v2.ant-menu-inline {
    border-right: none;
    background: transparent;
    text-align: left;
  }

  /* submenu titles */
  .sidebar-nav .ant-menu-submenu > .ant-menu-submenu-title {
    height: 2.857rem;
    line-height: 2.857rem;
    margin: 0;
    font-size: ${FONT_SIZE_M};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${CAP_G01};
  }

  /* nested submenus use smaller font */
  .sidebar-nav .ant-menu-sub .ant-menu-submenu > .ant-menu-submenu-title {
    font-size: ${FONT_SIZE_S};
  }

  .sidebar-nav .ant-menu-submenu > .ant-menu-submenu-title:hover {
    color: ${CAP_G01};
    background-color: ${BG_01};
  }

  /* leaf items */
  .sidebar-nav .ant-menu-item {
    height: 2.571rem;
    line-height: 2.571rem;
    margin: 0 !important;
    font-size: ${FONT_SIZE_S};
    color: ${CAP_G01};
  }

  /* top-level standalone items (no children) */
  .sidebar-nav .ant-menu-item.top-level-item {
    height: 2.857rem;
    line-height: 2.857rem;
    font-size: ${FONT_SIZE_M};
    font-weight: ${FONT_WEIGHT_MEDIUM};
  }

  .sidebar-nav .ant-menu-item:hover {
    color: ${CAP_SECONDARY.base};
    background-color: ${BG_01};
  }

  /* selected item */
  .sidebar-nav .ant-menu-item-selected {
    background-color: rgba(36, 102, 234, 0.08) !important;
    color: ${CAP_SECONDARY.base} !important;
    font-weight: ${FONT_WEIGHT_MEDIUM};
    border-left: 0.214rem solid ${CAP_SECONDARY.base};
  }

  .sidebar-nav .ant-menu-item-selected::after {
    display: none;
  }

  /* submenu titles always black */
  .sidebar-nav .ant-menu-submenu-selected > .ant-menu-submenu-title,
  .sidebar-nav .ant-menu-submenu-open > .ant-menu-submenu-title {
    color: ${CAP_G01} !important;
  }

  /* sub-menu container */
  .sidebar-nav .ant-menu-sub.ant-menu-inline {
    background: transparent;
    box-shadow: none;
  }

  /* arrows always black */
  .sidebar-nav .ant-menu-submenu-arrow::before,
  .sidebar-nav .ant-menu-submenu-arrow::after,
  .sidebar-nav .ant-menu-submenu-selected > .ant-menu-submenu-title > .ant-menu-submenu-arrow::before,
  .sidebar-nav .ant-menu-submenu-selected > .ant-menu-submenu-title > .ant-menu-submenu-arrow::after,
  .sidebar-nav .ant-menu-submenu-open > .ant-menu-submenu-title > .ant-menu-submenu-arrow::before,
  .sidebar-nav .ant-menu-submenu-open > .ant-menu-submenu-title > .ant-menu-submenu-arrow::after {
    background: ${CAP_G01} !important;
  }

  /* dynamic depth-based padding */
  ${depthPaddingRules}
`;
