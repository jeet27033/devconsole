import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

const {
  CAP_SPACE_04,
  CAP_SPACE_08,
  CAP_SPACE_12,
  CAP_SPACE_16,
  CAP_SPACE_24,
  CAP_SPACE_32,
  CAP_G04,
  CAP_G07,
  CAP_G09,
  CAP_G10,
  CAP_WHITE,
  CAP_BLUE01,
  CAP_PALE_GREY,
  FONT_COLOR_01,
  FONT_COLOR_02,
  FONT_SIZE_S,
  FONT_SIZE_M,
} = styledVars;

export default css`
  .date-time-picker-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${CAP_SPACE_12};
    border: 1px solid #b3bac5;
    border-radius: 0.25rem;
    cursor: pointer;
    background: ${CAP_WHITE};
    font-size: ${FONT_SIZE_M};
    color: ${FONT_COLOR_01};
    min-width: 20rem;
    height: 3rem;
    line-height: 1;
    transition: border-color 0.2s;

    &:hover {
      border-color: ${CAP_BLUE01};
    }
  }
`;

export const dropdownStyles = `
  .dtp-dropdown {
    position: fixed;
    z-index: 1051;
    display: flex;
    flex-direction: column;
    background: ${CAP_WHITE};
    border: 1px solid ${CAP_G07};
    border-radius: 0.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    max-height: 80vh;
    overflow: auto;
  }

  .dtp-body {
    display: flex;
  }

  /* ── Presets Panel ── */

  .dtp-presets {
    display: flex;
    flex-direction: column;
    border-right: 1px solid ${CAP_G07};
    min-width: 9.5rem;
    padding: ${CAP_SPACE_08};
    flex-shrink: 0;
    gap: 2px;
  }

  .dtp-preset-btn {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    cursor: pointer;
    font-size: ${FONT_SIZE_M};
    color: ${CAP_BLUE01};
    background: transparent;
    border: none;
    text-align: left;
    white-space: nowrap;
    line-height: 1.4;
    border-radius: 0.25rem;
    transition: background 0.15s;
  }

  .dtp-preset-btn:hover {
    background: ${CAP_PALE_GREY};
  }

  .dtp-preset-btn.active {
    background: ${CAP_BLUE01};
    color: ${CAP_WHITE};
  }

  /* ── Calendar Section ── */

  .dtp-calendar-section {
    padding: ${CAP_SPACE_16};
    display: flex;
    flex-direction: column;
    gap: ${CAP_SPACE_16};
  }

  .dtp-time-row {
    display: flex;
    gap: ${CAP_SPACE_24};
  }

  .dtp-time-group {
    flex: 1;
  }

  .dtp-datetime-display {
    padding: ${CAP_SPACE_08} ${CAP_SPACE_12};
    border: 1px solid ${CAP_G07};
    border-radius: 0.25rem;
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_01};
    display: flex;
    align-items: center;
    gap: ${CAP_SPACE_08};
    margin-bottom: ${CAP_SPACE_08};
    background: ${CAP_G10};
    white-space: nowrap;
  }

  .dtp-time-selects {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .dtp-time-selects select {
    padding: 0.25rem 0.375rem;
    border: 1px solid ${CAP_G07};
    border-radius: 0.25rem;
    font-size: ${FONT_SIZE_S};
    color: ${FONT_COLOR_01};
    background: ${CAP_WHITE};
    cursor: pointer;
    min-width: 3rem;
    height: 1.75rem;
    appearance: auto;
    transition: border-color 0.2s;
  }

  .dtp-time-selects select:focus {
    outline: none;
    border-color: ${CAP_BLUE01};
  }

  .dtp-time-colon {
    font-weight: 600;
    color: ${CAP_G04};
    font-size: ${FONT_SIZE_M};
  }

  /* ── Calendars ── */

  .dtp-calendars {
    display: flex;
    gap: ${CAP_SPACE_32};
  }

  .dtp-cal {
    min-width: 14rem;
  }

  .dtp-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${CAP_SPACE_08};
    height: 1.75rem;
  }

  .dtp-cal-nav {
    background: ${CAP_WHITE};
    border: 1px solid ${CAP_G07};
    border-radius: 0.25rem;
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: ${FONT_COLOR_01};
    transition: background 0.15s;
  }

  .dtp-cal-nav:hover {
    background: ${CAP_G09};
  }

  .dtp-cal-title {
    font-size: ${FONT_SIZE_M};
    font-weight: 600;
    color: ${FONT_COLOR_01};
  }

  .dtp-cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
  }

  .dtp-cal-dow {
    font-size: 0.6875rem;
    color: ${FONT_COLOR_02};
    padding: 0.25rem 0;
    font-weight: 600;
  }

  .dtp-cal-day {
    padding: 0.25rem;
    font-size: ${FONT_SIZE_S};
    cursor: pointer;
    border: none;
    background: transparent;
    color: ${FONT_COLOR_01};
    border-radius: 0.25rem;
    line-height: 1.6;
    transition: background 0.1s;
  }

  .dtp-cal-day:hover {
    background: ${CAP_PALE_GREY};
  }

  .dtp-cal-day.other {
    color: ${CAP_G07};
  }

  .dtp-cal-day.in-range {
    background: ${CAP_PALE_GREY};
    border-radius: 0;
  }

  .dtp-cal-day.selected {
    background: ${CAP_BLUE01};
    color: ${CAP_WHITE};
  }

  .dtp-cal-day.today {
    font-weight: 700;
    border: 1px solid ${CAP_BLUE01};
  }

  /* ── Footer ── */

  .dtp-footer {
    display: flex;
    justify-content: flex-end;
    gap: ${CAP_SPACE_08};
    padding: ${CAP_SPACE_12} ${CAP_SPACE_16};
    border-top: 1px solid ${CAP_G07};
  }
`;
