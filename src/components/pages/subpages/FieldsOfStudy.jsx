import { useEffect } from 'react';
import './SubpageShell.css';

export default function FieldsOfStudy({ onReturn }) {
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
          <span className="subpage-logo">Zeeshaan</span>
          <span className="subpage-category-tag">WORKS // 05</span>
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

      {/* Centered Page Title */}
      <main className="subpage-main">
        <h1 className="subpage-title">FIELDS OF STUDY</h1>
        <div className="subpage-subtitle">ACADEMIC DISCIPLINES // RESEARCH DOMAINS</div>
      </main>

      {/* Footer */}
      <footer className="subpage-footer">
        <span className="subpage-footer-hint">PRESS [ESC] OR [ENTER] TO RETURN</span>
      </footer>
    </div>
  );
}
