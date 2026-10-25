import { useCallback, useState } from 'react';
import { useGithubActivity, useLeetcodeActivity } from '../hooks/useActivity';
import ContributionCalendar from './ContributionCalendar';
import LeetcodeSummary from './LeetcodeSummary';

function YearSelect({ id, years, value, onChange }) {
  if (!years.length) return null;

  if (years.length === 1) {
    return (
      <span className="chart-year" aria-label={`Year ${value}`}>
        <span className="chart-year-label">year</span>
        <span className="chart-year-static">{value}</span>
      </span>
    );
  }

  return (
    <span className="chart-year">
      <label className="chart-year-label" htmlFor={id}>
        year
      </label>
      <select
        id={id}
        className="chart-year-select"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </span>
  );
}

export default function ActivityDashboard({ github, leetcode }) {
  const [view, setView] = useState(0);
  const [githubYear, setGithubYear] = useState(null);
  const [leetcodeYear, setLeetcodeYear] = useState(null);
  const githubActivity = useGithubActivity(github.username);
  const leetcodeActivity = useLeetcodeActivity(leetcode.username);

  const activeGithubYear = githubYear ?? githubActivity.years[0] ?? null;
  const activeLeetcodeYear = leetcodeYear ?? leetcodeActivity.years[0] ?? null;

  const move = useCallback((direction) => {
    setView((current) => (current + direction + 2) % 2);
  }, []);

  const handleKeyDown = (event) => {
    // Let the year select keep its own arrow-key behaviour.
    if (event.target instanceof HTMLSelectElement) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  const sourceName = view === 0 ? 'github' : 'leetcode';

  return (
    <section className="activity" aria-labelledby="activity-heading" onKeyDown={handleKeyDown}>
      <div className="activity-head">
        <div>
          <p className="activity-kicker">activity</p>
          <h3 id="activity-heading">{view === 0 ? 'contribution log' : 'problem solving'}</h3>
        </div>

        <div className="activity-controls">
          <button
            type="button"
            className="activity-arrow"
            onClick={() => move(-1)}
            aria-label="Show previous activity source"
          >
            <span aria-hidden="true">←</span>
          </button>

          <p className="activity-indicator" aria-live="polite">
            <span className="activity-indicator-name">{sourceName}</span>
            <span className="activity-indicator-count">{String(view + 1).padStart(2, '0')} / 02</span>
          </p>

          <button
            type="button"
            className="activity-arrow"
            onClick={() => move(1)}
            aria-label="Show next activity source"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="activity-viewport">
        <div className="activity-track" style={{ transform: `translateX(-${view * 100}%)` }}>
          <div
            className="activity-slide"
            aria-hidden={view !== 0}
            inert={view !== 0}
          >
            <div className="activity-meta">
              <p className="activity-source">
                <span className="activity-source-name">github</span>
                <span>@{github.username}</span>
              </p>

              <div className="activity-meta-right">
                <YearSelect
                  id="github-year"
                  years={githubActivity.years}
                  value={activeGithubYear}
                  onChange={setGithubYear}
                />
                <a href={github.url} target="_blank" rel="noreferrer" className="activity-profile">
                  profile <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="activity-body">
              <div className="activity-chart">
                <ContributionCalendar
                  activity={githubActivity}
                  kind="github"
                  year={activeGithubYear}
                  noun="contributions"
                  unit="contribution"
                  onRetry={githubActivity.reload}
                />
              </div>
            </div>
          </div>

          <div
            className="activity-slide"
            aria-hidden={view !== 1}
            inert={view !== 1}
          >
            <div className="activity-meta">
              <p className="activity-source">
                <span className="activity-source-name">leetcode</span>
                <span>{leetcode.username ? `@${leetcode.username}` : 'profile not linked'}</span>
              </p>
              <div className="activity-meta-right">
                <YearSelect
                  id="leetcode-year"
                  years={leetcodeActivity.years}
                  value={activeLeetcodeYear}
                  onChange={setLeetcodeYear}
                />
                {leetcode.url ? (
                  <a href={leetcode.url} target="_blank" rel="noreferrer" className="activity-profile">
                    profile <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="activity-profile is-muted">not linked</span>
                )}
              </div>
            </div>

            <div className="activity-body">
              <div className="activity-chart">
                <ContributionCalendar
                  activity={leetcodeActivity}
                  kind="leetcode"
                  year={activeLeetcodeYear}
                  noun="submissions"
                  unit="submission"
                  onRetry={leetcodeActivity.reload}
                />
              </div>

              <LeetcodeSummary problems={leetcodeActivity.problems} />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
