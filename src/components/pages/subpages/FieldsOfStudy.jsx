import { useEffect } from 'react';
import { portfolioData } from '../../../data/portfolioData';
import './SubpageShell.css';

export default function FieldsOfStudy({ onReturn }) {
  const { personal, fieldsOfStudy } = portfolioData;

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
    <div className="subpage-container" role="main" aria-label="Fields of Study page">
      {/* Top Header */}
      <header className="subpage-header">
        <div className="subpage-brand">
          <span className="subpage-logo">{personal.shortName}</span>
          <span className="subpage-category-tag">WORKS // 05</span>
        </div>

        <div className="subpage-header-title-group">
          <h1 className="subpage-header-title">FIELDS OF STUDY</h1>
          <div className="subpage-header-subtitle">ACADEMIC DISCIPLINES // DOMAIN SPECIALIZATIONS</div>
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
          <div className="fields-grid">
            {fieldsOfStudy.map((field) => (
              <article key={field.id} className="field-card" aria-label={field.title}>
                <div>
                  <div className="field-card-header">
                    <h2 className="field-card-title">{field.title}</h2>
                    <span className="field-tag-badge">{field.tag}</span>
                  </div>
                  <p className="field-desc">{field.description}</p>
                </div>

                <div className="field-skills-wrap" aria-label="Supporting Technologies & Coursework">
                  {field.skills.map((skill) => (
                    <span key={skill} className="field-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
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
