import { useCallback, useState } from 'react';
import { useGithubActivity, useLeetcodeActivity } from '../hooks/useActivity';
import ContributionCalendar from './ContributionCalendar';

export default function ActivityDashboard({ github, leetcode }) {
  const [view, setView] = useState(0);
  const githubActivity = useGithubActivity(github.username);
  const leetcodeActivity = useLeetcodeActivity(leetcode.username);

  const move = useCallback((direction) => {
    setView((current) => (current + direction + 2) % 2);
  }, []);

  const handleKeyDown = (event) => {
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
          <h3 id="activity-heading">contribution log</h3>
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
              <a href={github.url} target="_blank" rel="noreferrer" className="activity-profile">
                profile <span aria-hidden="true">↗</span>
              </a>
            </div>

            <ContributionCalendar
              activity={githubActivity}
              kind="github"
              noun="contributions"
              unit="contribution"
              onRetry={githubActivity.reload}
            />
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
              {leetcode.url ? (
                <a href={leetcode.url} target="_blank" rel="noreferrer" className="activity-profile">
                  profile <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className="activity-profile is-muted">not linked</span>
              )}
            </div>

            <ContributionCalendar
              activity={leetcodeActivity}
              kind="leetcode"
              noun="submissions"
              unit="submission"
              onRetry={leetcodeActivity.reload}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
