import { useMemo } from 'react';
import { buildCalendar, filterDaysByYear } from '../lib/calendar';

const SKELETON_MONTHS = [5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 5];

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
                          title={`${day.count} ${day.count === 1 ? unit : noun} on ${day.date}`}
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
    </figure>
  );
}
