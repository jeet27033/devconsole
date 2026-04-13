import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import CapButton from '@capillarytech/cap-ui-library/CapButton';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';

import style, { dropdownStyles } from './style';
import messages from './messages';
import {
  PRESET_RANGES,
  DAYS_OF_WEEK,
  MONTHS,
  DEFAULT_PRESET,
  HOURS,
  MINUTES_SECONDS,
} from './constants';

/* ── helpers ── */

const formatDate = (date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
};

const getPresetDates = (preset) => {
  const now = new Date();
  const start = new Date(now);
  if (preset.unit === 'minutes') {
    start.setMinutes(start.getMinutes() - preset.amount);
  } else if (preset.unit === 'days') {
    start.setDate(start.getDate() - preset.amount);
  }
  return { startDate: start, endDate: now };
};

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

/* ── inject global dropdown styles once ── */

let styleInjected = false;
const injectDropdownStyles = () => {
  if (styleInjected) return;
  const tag = document.createElement('style');
  tag.textContent = dropdownStyles;
  document.head.appendChild(tag);
  styleInjected = true;
};

/* ── TimeSelect (native select for reliability) ── */

const TimeSelect = ({ options, value, onChange }) => (
  <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

/* ── CalendarMonth ── */

const CalendarMonth = ({ year, month, startDate, endDate, onDayClick, onPrev, onNext, showNav }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, other: false });
  }
  const rem = 7 - (cells.length % 7);
  if (rem < 7) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    for (let d = 1; d <= rem; d++) {
      cells.push({ day: d, month: nm, year: ny, other: true });
    }
  }

  const dayTs = (c) => {
    const dt = new Date(c.year, c.month, c.day);
    dt.setHours(0, 0, 0, 0);
    return dt.getTime();
  };
  const sTs = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime() : null;
  const eTs = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() : null;

  const isToday = (c) =>
    c.day === today.getDate() && c.month === today.getMonth() && c.year === today.getFullYear();

  return (
    <div className="dtp-cal">
      <div className="dtp-cal-header">
        {showNav === 'left' ? (
          <button type="button" className="dtp-cal-nav" onClick={onPrev}>&lsaquo;</button>
        ) : <span />}
        <span className="dtp-cal-title">{MONTHS[month].slice(0, 3)} {year}</span>
        {showNav === 'right' ? (
          <button type="button" className="dtp-cal-nav" onClick={onNext}>&rsaquo;</button>
        ) : <span />}
      </div>
      <div className="dtp-cal-grid">
        {DAYS_OF_WEEK.map((d) => (
          <span key={d} className="dtp-cal-dow">{d}</span>
        ))}
        {cells.map((c, i) => {
          const t = dayTs(c);
          const cls = ['dtp-cal-day'];
          if (c.other) cls.push('other');
          if (t === sTs || t === eTs) cls.push('selected');
          else if (sTs && eTs && t > sTs && t < eTs) cls.push('in-range');
          if (isToday(c)) cls.push('today');
          return (
            <button
              type="button"
              key={`${c.year}-${c.month}-${c.day}-${i}`}
              className={cls.join(' ')}
              onClick={() => onDayClick(new Date(c.year, c.month, c.day))}
            >
              {c.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

CalendarMonth.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  onDayClick: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  showNav: PropTypes.oneOf(['left', 'right']),
};

/* ── Main Component ── */

const DateAndTimePicker = ({ className, intl, onApply }) => {
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const defaultPreset = PRESET_RANGES.find((p) => p.value === DEFAULT_PRESET);
  const [startDate, setStartDate] = useState(() => getPresetDates(defaultPreset).startDate);
  const [endDate, setEndDate] = useState(() => getPresetDates(defaultPreset).endDate);
  const [displayLabel, setDisplayLabel] = useState(defaultPreset.label);

  const [leftMonth, setLeftMonth] = useState(() => {
    const d = startDate || new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  useEffect(() => {
    injectDropdownStyles();
  }, []);

  useEffect(() => {
    setActivePreset(DEFAULT_PRESET);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const openDropdown = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setIsOpen(true);
  }, []);

  const handlePresetClick = useCallback((preset) => {
    setActivePreset(preset.value);
    setIsCustom(false);
    const { startDate: s, endDate: e } = getPresetDates(preset);
    setStartDate(s);
    setEndDate(e);
    setLeftMonth({ year: s.getFullYear(), month: s.getMonth() });
  }, []);

  const handleCustomClick = useCallback(() => {
    setActivePreset(null);
    setIsCustom(true);
    setSelectingStart(true);
  }, []);

  const handleDayClick = useCallback((date) => {
    setActivePreset(null);
    setIsCustom(true);
    if (selectingStart) {
      const ns = new Date(date);
      ns.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
      setStartDate(ns);
      setSelectingStart(false);
    } else {
      const ne = new Date(date);
      ne.setHours(endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
      if (ne < startDate) {
        setStartDate(ne);
        setEndDate(startDate);
      } else {
        setEndDate(ne);
      }
      setSelectingStart(true);
    }
  }, [selectingStart, startDate, endDate]);

  const handleTimeChange = useCallback((which, field, value) => {
    const setter = which === 'start' ? setStartDate : setEndDate;
    const current = which === 'start' ? startDate : endDate;
    const updated = new Date(current);
    if (field === 'hours') updated.setHours(value);
    else if (field === 'minutes') updated.setMinutes(value);
    else if (field === 'seconds') updated.setSeconds(value);
    setter(updated);
    setActivePreset(null);
    setIsCustom(true);
  }, [startDate, endDate]);

  const handleApply = useCallback(() => {
    setIsOpen(false);
    if (activePreset) {
      setDisplayLabel(PRESET_RANGES.find((p) => p.value === activePreset).label);
    } else {
      setDisplayLabel(`${formatDate(startDate)} - ${formatDate(endDate)}`);
    }
    if (onApply) onApply({ startDate, endDate, preset: activePreset });
  }, [startDate, endDate, activePreset, onApply]);

  const handleCancel = useCallback(() => setIsOpen(false), []);

  const handlePrevMonth = useCallback(() => {
    setLeftMonth((p) => ({
      year: p.month === 0 ? p.year - 1 : p.year,
      month: p.month === 0 ? 11 : p.month - 1,
    }));
  }, []);

  const handleNextMonth = useCallback(() => {
    setLeftMonth((p) => ({
      year: p.month === 11 ? p.year + 1 : p.year,
      month: p.month === 11 ? 0 : p.month + 1,
    }));
  }, []);

  const rightMonth = useMemo(() => ({
    year: leftMonth.month === 11 ? leftMonth.year + 1 : leftMonth.year,
    month: leftMonth.month === 11 ? 0 : leftMonth.month + 1,
  }), [leftMonth]);

  const dropdown = isOpen ? ReactDOM.createPortal(
    <>
      <div
        className="dtp-dropdown"
        ref={dropdownRef}
        style={{ top: dropdownPos.top, left: dropdownPos.left }}
      >
        <div className="dtp-body">
          <div className="dtp-presets">
            {PRESET_RANGES.map((p) => (
              <button
                type="button"
                key={p.value}
                className={`dtp-preset-btn ${activePreset === p.value ? 'active' : ''}`}
                onClick={() => handlePresetClick(p)}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              className={`dtp-preset-btn ${isCustom ? 'active' : ''}`}
              onClick={handleCustomClick}
            >
              {intl.formatMessage(messages.customRange)}
            </button>
          </div>

          <div className="dtp-calendar-section">
            <div className="dtp-time-row">
              <div className="dtp-time-group">
                <div className="dtp-datetime-display">
                  <CapIcon type="calendar" />
                  <span>{formatDate(startDate)}</span>
                </div>
                <div className="dtp-time-selects">
                  <TimeSelect options={HOURS} value={startDate.getHours()} onChange={(v) => handleTimeChange('start', 'hours', v)} />
                  <span className="dtp-time-colon">:</span>
                  <TimeSelect options={MINUTES_SECONDS} value={startDate.getMinutes()} onChange={(v) => handleTimeChange('start', 'minutes', v)} />
                  <span className="dtp-time-colon">:</span>
                  <TimeSelect options={MINUTES_SECONDS} value={startDate.getSeconds()} onChange={(v) => handleTimeChange('start', 'seconds', v)} />
                </div>
              </div>
              <div className="dtp-time-group">
                <div className="dtp-datetime-display">
                  <CapIcon type="calendar" />
                  <span>{formatDate(endDate)}</span>
                </div>
                <div className="dtp-time-selects">
                  <TimeSelect options={HOURS} value={endDate.getHours()} onChange={(v) => handleTimeChange('end', 'hours', v)} />
                  <span className="dtp-time-colon">:</span>
                  <TimeSelect options={MINUTES_SECONDS} value={endDate.getMinutes()} onChange={(v) => handleTimeChange('end', 'minutes', v)} />
                  <span className="dtp-time-colon">:</span>
                  <TimeSelect options={MINUTES_SECONDS} value={endDate.getSeconds()} onChange={(v) => handleTimeChange('end', 'seconds', v)} />
                </div>
              </div>
            </div>

            <div className="dtp-calendars">
              <CalendarMonth
                year={leftMonth.year}
                month={leftMonth.month}
                startDate={startDate}
                endDate={endDate}
                onDayClick={handleDayClick}
                onPrev={handlePrevMonth}
                showNav="left"
              />
              <CalendarMonth
                year={rightMonth.year}
                month={rightMonth.month}
                startDate={startDate}
                endDate={endDate}
                onDayClick={handleDayClick}
                onNext={handleNextMonth}
                showNav="right"
              />
            </div>
          </div>
        </div>

        <div className="dtp-footer">
          <CapButton type="primary" onClick={handleApply}>
            {intl.formatMessage(messages.apply)}
          </CapButton>
          <CapButton onClick={handleCancel}>
            {intl.formatMessage(messages.cancel)}
          </CapButton>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className={className}>
      <div
        className="date-time-picker-trigger"
        ref={triggerRef}
        onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && (isOpen ? setIsOpen(false) : openDropdown())}
      >
        <span>{displayLabel}</span>
        <CapIcon type="calendar" />
      </div>
      {dropdown}
    </div>
  );
};

DateAndTimePicker.propTypes = {
  className: PropTypes.string,
  intl: PropTypes.object.isRequired,
  onApply: PropTypes.func,
};

DateAndTimePicker.defaultProps = {
  className: '',
  onApply: null,
};

export default injectIntl(withStyles(DateAndTimePicker, style));
