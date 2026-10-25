import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildCalendar, filterDaysByYear } from '../lib/calendar';

const SKELETON_MONTHS = [5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 5];

function formatDay(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

function formatSnapshot(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}

function StateMessage({ label, children }) {
  return (
    <div className="activity-state">
      <span className="activity-state-label">{label}</span>
      <p>{children}</p>
    </div>
  );
}

export default function ContributionCalendar({ activity, kind, year, noun = 'contributions', unit = 'contribution', onRetry }) {
  const days = useMemo(() => filterDaysByYear(activity.days, year), [activity.days, year]);
  const calendar = useMemo(() => buildCalendar(days), [days]);

  const tipRef = useRef(null);
  const [tip, setTip] = useState(null);

  const showTip = useCallback(
    (event, day) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const above = rect.top > 64;

      setTip({
        date: formatDay(day.date),
        count: day.count === 0 ? `no ${noun}` : `${day.count} ${day.count === 1 ? unit : noun}`,
        x: rect.left + rect.width / 2,
        y: above ? rect.top - 7 : rect.bottom + 7,
        above
      });
    },
    [noun, unit]
  );

  const hideTip = useCallback(() => setTip(null), []);

  // Keep the card fully inside the viewport when a cell sits near an edge.
  useLayoutEffect(() => {
    if (!tip || !tipRef.current) return;

    const half = tipRef.current.offsetWidth / 2 + 8;
    const clamped = Math.min(Math.max(tip.x, half), Math.max(half, window.innerWidth - half));

    if (Math.abs(clamped - tip.x) > 0.5) {
      setTip((current) => (current ? { ...current, x: clamped } : current));
    }
  }, [tip]);

  // The card is anchored to a cell, so any scroll or resize invalidates it.
  useEffect(() => {
    if (!tip) return undefined;

    const dismiss = () => setTip(null);

    window.addEventListener('scroll', dismiss, { passive: true, capture: true });
    window.addEventListener('resize', dismiss);

    return () => {
      window.removeEventListener('scroll', dismiss, { capture: true });
      window.removeEventListener('resize', dismiss);
    };
  }, [tip]);

  if (activity.status === 'loading') {
    return (
      <div className="calendar-loading" aria-busy="true">
        <span className="sr-only">Loading {kind} activity...</span>
        <div className="cal-track calendar-skeleton" aria-hidden="true">
          {SKELETON_MONTHS.map((weekCount, monthIndex) => (
            <div className="cal-month" key={monthIndex}>
              <span className="cal-month-label" />
              <div className="cal-month-grid">
                {Array.from({ length: weekCount * 7 }).map((_, cellIndex) => (
                  <span key={cellIndex} className="skeleton-cell" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="calendar-loading-label">loading activity...</p>
      </div>
    );
  }

  if (activity.status === 'unconfigured') {
    return (
      <StateMessage label="unlinked">
        {kind === 'leetcode' ? 'LeetCode activity is not linked yet.' : 'Activity is not configured yet.'}
      </StateMessage>
    );
  }

  if (activity.status === 'error') {
    return (
      <div className="activity-state">
        <span className="activity-state-label">error</span>
        <p>{activity.error}</p>
        {onRetry && (
          <button type="button" className="activity-retry" onClick={onRetry}>
            retry <span aria-hidden="true">↻</span>
          </button>
        )}
      </div>
    );
  }

  if (!calendar || calendar.total === 0) {
    return (
      <StateMessage label="empty">
        No public activity in {year ? `${year}.` : 'the last 12 months.'}
      </StateMessage>
    );
  }

  const snapshot = formatSnapshot(activity.syncedAt);
  const { activeDays } = calendar;

  return (
    <figure className="calendar">
      <div className="calendar-scroll">
        <div className="calendar-inner">
          <div
            className="cal-track"
            role="img"
            aria-label={`${calendar.total} ${noun} in the last 12 months, across ${activeDays} active days.`}
          >
            {calendar.months.map((month) => (
              <div className="cal-month" key={month.key}>
                <span className="cal-month-label" aria-hidden="true">
                  {month.label}
                </span>
                <div className="cal-month-grid">
                  {month.weeks.map((week, weekIndex) =>
                    week.map((day, dayIndex) =>
                      day ? (
                        <span
                          key={day.date}
                          className={`cal-cell level-${day.level}`}
                          onPointerEnter={(event) => showTip(event, day)}
                          onPointerLeave={hideTip}
                        />
                      ) : (
                        <span
                          key={`empty-${weekIndex}-${dayIndex}`}
                          className="cal-cell is-empty"
                        />
                      )
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-foot">
        <p className="calendar-summary">
          <strong>{calendar.total.toLocaleString('en')}</strong> {noun}
          <span className="calendar-sep" aria-hidden="true">
            ·
          </span>
          {activeDays} active days
          {Number.isFinite(activity.solvedTotal) && (
            <>
              <span className="calendar-sep" aria-hidden="true">
                ·
              </span>
              <span>{activity.solvedTotal} solved</span>
            </>
          )}
          {snapshot && (
            <>
              <span className="calendar-sep" aria-hidden="true">
                ·
              </span>
              <span className="calendar-snapshot">snapshot {snapshot}</span>
            </>
          )}
        </p>

        <div className="cal-legend" aria-hidden="true">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`cal-cell level-${level}`} />
          ))}
          <span>more</span>
        </div>
      </div>

      {tip &&
        createPortal(
          <div
            ref={tipRef}
            className={`cal-tip${tip.above ? ' is-above' : ' is-below'}`}
            style={{ left: `${tip.x}px`, top: `${tip.y}px` }}
            role="presentation"
          >
            <span className="cal-tip-count">{tip.count}</span>
            <span className="cal-tip-date">{tip.date}</span>
          </div>,
          document.body
        )}
    </figure>
  );
}
