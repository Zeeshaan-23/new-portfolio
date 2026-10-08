import { useEffect } from 'react';
import { portfolioData } from '../../../data/portfolioData';
import './SubpageShell.css';

export default function Projects({ onReturn }) {
  const { personal, projects } = portfolioData;

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
    <div className="subpage-container" role="main" aria-label="Projects page">
      {/* Top Header */}
      <header className="subpage-header">
        <div className="subpage-brand">
          <span className="subpage-logo">{personal.shortName}</span>
          <span className="subpage-category-tag">WORKS // 02</span>
        </div>

        <div className="subpage-header-title-group">
          <h1 className="subpage-header-title">PROJECTS</h1>
          <div className="subpage-header-subtitle">PORTFOLIO ARCHIVE // FEATURED WORK</div>
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
          <div className="projects-list">
            {projects.map((proj, idx) => (
              <article key={proj.id} className="project-card" aria-label={proj.title}>
                <div className="project-card-header">
                  <div className="project-header-left">
                    <h2 className="project-card-title">{proj.title}</h2>
                    <span className="project-role-badge">{proj.role}</span>
                    <span className="project-time-badge">{proj.timeline}</span>
                    {proj.deployment && (
                      <span className="project-deploy-badge">{`DEPLOYED: ${proj.deployment}`}</span>
                    )}
                  </div>
                  <span className="project-card-idx">{`// ARCHIVE_0${idx + 1}`}</span>
                </div>

                <div className="project-stack-wrap" aria-label="Technology Stack">
                  {proj.stack.map((tech) => (
                    <span key={tech} className="project-stack-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="project-desc-p">{proj.description}</p>

                <ul className="project-bullets-list">
                  {proj.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="project-bullet-item">
                      <span className="project-bullet-marker" aria-hidden="true">▶</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
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
