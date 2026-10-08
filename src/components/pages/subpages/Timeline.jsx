import { useEffect } from 'react';
import { portfolioData } from '../../../data/portfolioData';
import './SubpageShell.css';

export default function Timeline({ onReturn }) {
  const { personal, timeline } = portfolioData;
  // Display latest milestones first (reverse-chronological)
  const sortedTimeline = [...timeline].reverse();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        onReturn?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturn]);

  return (
    <div className="subpage-container" role="main" aria-label="Timeline page">
      {/* Top Header */}
      <header className="subpage-header">
        <div className="subpage-brand">
          <span className="subpage-logo">{personal.shortName}</span>
          <span className="subpage-category-tag">WORKS // 04</span>
        </div>

        <div className="subpage-header-title-group">
          <h1 className="subpage-header-title">TIMELINE</h1>
          <div className="subpage-header-subtitle">CAREER MILESTONES // EXPERIENCE LOG</div>
        </div>

        <button
          type="button"
          className="subpage-return-btn"
          onClick={onReturn}
          aria-label="Return to works menu"
        >
          <span>▲</span>
          <span>RETURN TO WORKS</span>
          <span className="subpage-return-badge">[ESC]</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="subpage-main">


        <div className="subpage-content-scroll">
          <div className="timeline-track" role="list">
            {sortedTimeline.map((item, idx) => (
              <div
                key={idx}
                className={`timeline-entry ${item.isCurrent ? 'is-current' : ''}`}
                role="listitem"
              >
                <div className="timeline-node" aria-hidden="true" />
                <article className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="timeline-date-group">
                      <time className="timeline-date-badge">{item.date}</time>
                      <span className="timeline-status-badge">
                        {item.isCurrent ? 'ACTIVE // CURRENT ROLE' : item.badge}
                      </span>
                    </div>
                  </div>

                  <h2 className="timeline-item-title">{item.title}</h2>
                  <div className="timeline-item-subtitle">{item.subtitle}</div>
                  <p className="timeline-item-desc">{item.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="subpage-footer">
        <span className="subpage-footer-hint">PRESS [ESC] OR [ENTER] TO RETURN</span>
      </footer>
    </div>
  );
}
