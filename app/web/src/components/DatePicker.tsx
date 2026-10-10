import { useState } from 'react';
import { addDays } from '../../../shared/dates.ts';
import { formatCalendarDate, formatMonth } from '../format.ts';
import { useI18n } from '../i18n.tsx';

interface DatePickerProps {
  id: string; // used for test ids: "<id>-input", "<id>-day-2026-11-02", ...
  label: string;
  value: string | null; // YYYY-MM-DD
  min: string; // earliest selectable day
  max: string; // latest selectable day
  isDayDisabled?: (day: string) => boolean;
  disabled?: boolean;
  onChange(day: string): void;
}

/** "2026-11" -> "2026-12" */
function shiftMonth(yearMonth: string, months: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));
  return date.toISOString().slice(0, 7);
}

/** The days of a month as ISO dates, padded with nulls so the 1st falls on the right weekday (Sunday first). */
function monthGrid(yearMonth: string): (string | null)[] {
  const first = `${yearMonth}-01`;
  const leadingBlanks = new Date(`${first}T00:00:00Z`).getUTCDay();
  const days: (string | null)[] = Array(leadingBlanks).fill(null);
  for (let day = first; day.startsWith(yearMonth); day = addDays(day, 1)) days.push(day);
  return days;
}

// A simple calendar. Every day is a real <button> with a full date as its accessible name,
// so it works with a keyboard and screen readers, and is easy to target in tests.
export function DatePicker({ id, label, value, min, max, isDayDisabled, disabled, onChange }: DatePickerProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState((value ?? min).slice(0, 7));

  function toggle() {
    setVisibleMonth((value ?? min).slice(0, 7));
    setOpen((isOpen) => !isOpen);
  }

  const valueText = value ? formatCalendarDate(value, locale) : t('datePicker.placeholder');

  return (
    <div className="date-picker">
      <span className="field-label">{label}</span>
      <button
        type="button"
        className="date-input"
        data-testid={`${id}-input`}
        aria-label={`${label}: ${valueText}`}
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
      >
        {valueText}
      </button>

      {open && (
        <div className="calendar" role="group" aria-label={label} data-testid={`${id}-calendar`}>
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav"
              data-testid={`${id}-prev`}
              aria-label={t('datePicker.previousMonth')}
              disabled={visibleMonth <= min.slice(0, 7)}
              onClick={() => setVisibleMonth(shiftMonth(visibleMonth, -1))}
            >
              ‹
            </button>
            <span className="calendar-month" data-testid={`${id}-month`} aria-live="polite">
              {formatMonth(visibleMonth, locale)}
            </span>
            <button
              type="button"
              className="calendar-nav"
              data-testid={`${id}-next`}
              aria-label={t('datePicker.nextMonth')}
              disabled={visibleMonth >= max.slice(0, 7)}
              onClick={() => setVisibleMonth(shiftMonth(visibleMonth, 1))}
            >
              ›
            </button>
          </div>
          <div className="calendar-grid">
            {monthGrid(visibleMonth).map((day, index) =>
              day ? (
                <button
                  key={day}
                  type="button"
                  className="calendar-day"
                  data-testid={`${id}-day-${day}`}
                  aria-label={formatCalendarDate(day, locale, 'full')}
                  aria-pressed={day === value}
                  disabled={day < min || day > max || Boolean(isDayDisabled?.(day))}
                  onClick={() => {
                    onChange(day);
                    setOpen(false);
                  }}
                >
                  {Number(day.slice(8))}
                </button>
              ) : (
                <span key={`blank-${index}`} aria-hidden="true" />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
