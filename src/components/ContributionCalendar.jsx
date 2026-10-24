import { useMemo } from 'react';
import { buildCalendar } from '../lib/calendar';

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

export default function ContributionCalendar({ activity, kind, noun = 'contributions', unit = 'contribution', onRetry }) {
  const calendar = useMemo(() => buildCalendar(activity.days), [activity.days]);

  if (activity.status === 'loading') {
    return (
      <div className="calendar-loading" aria-busy="true">
        <span className="sr-only">Loading {kind} activity...</span>
        <div className="calendar-skeleton" aria-hidden="true">
          {Array.from({ length: 53 * 7 }).map((_, index) => (
            <span key={index} className="skeleton-cell" />
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
    return <StateMessage label="empty">No public activity in the last 12 months.</StateMessage>;
  }

  const snapshot = formatSnapshot(activity.syncedAt);
  const activeDays = activity.activeDays || calendar.activeDays;

  return (
    <figure className="calendar">
      <div className="calendar-scroll">
        <div className="calendar-inner">
          <div className="cal-months" aria-hidden="true">
            {calendar.monthLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>

          <div
            className="cal-grid"
            role="img"
            aria-label={`${calendar.total} ${noun} in the last 12 months, across ${activeDays} active days.`}
          >
            {calendar.weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) =>
                day ? (
                  <span
                    key={`${weekIndex}-${dayIndex}`}
                    className={`cal-cell level-${day.level}`}
                    title={`${day.count} ${day.count === 1 ? unit : noun} on ${day.date}`}
                  />
                ) : (
                  <span key={`${weekIndex}-${dayIndex}`} className="cal-cell is-empty" />
                )
              )
            )}
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
