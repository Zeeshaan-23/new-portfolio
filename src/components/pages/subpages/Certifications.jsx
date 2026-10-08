import { useEffect } from 'react';
import { portfolioData } from '../../../data/portfolioData';
import './SubpageShell.css';

export default function Certifications({ onReturn }) {
  const { personal, certifications, achievements } = portfolioData;

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
    <div className="subpage-container" role="main" aria-label="Certifications and Achievements page">
      {/* Top Header */}
      <header className="subpage-header">
        <div className="subpage-brand">
          <span className="subpage-logo">{personal.shortName}</span>
          <span className="subpage-category-tag">WORKS // 03</span>
        </div>

        <div className="subpage-header-title-group">
          <h1 className="subpage-header-title">CERTIFICATIONS</h1>
          <div className="subpage-header-subtitle">CREDENTIALS // INDUSTRY ACCREDITATIONS</div>
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
          <div className="certs-container">
            {/* Section 1: Accredited Certifications */}
            <section aria-labelledby="certs-heading">
              <div className="certs-section-heading">
                <h2 id="certs-heading" className="certs-section-title">Accredited Certifications</h2>
                <span className="certs-section-badge">VERIFIED CREDENTIALS</span>
              </div>

              <div className="certs-grid">
                {certifications.map((cert) => (
                  <div key={cert.name} className="cert-card">
                    <div className="cert-card-top">
                      <span className="cert-issuer-badge">{cert.issuer}</span>
                      <span className="cert-verified-tag">[ACCREDITED]</span>
                    </div>
                    <h3 className="cert-title">{cert.name}</h3>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Supporting Achievements (Visually Distinct) */}
            <section aria-labelledby="achievements-heading">
              <div className="certs-section-heading">
                <h2 id="achievements-heading" className="certs-section-title">Supporting Achievements</h2>
                <span className="certs-section-badge">APPLIED PRACTICE &amp; LABS</span>
              </div>

              <div className="achievements-grid">
                {/* Competitive Programming */}
                <article className="achievement-card">
                  <div className="achievement-header">
                    <h3 className="achievement-title">{achievements.competitiveProgramming.title}</h3>
                    <span className="achievement-badge">LEETCODE // DSA</span>
                  </div>
                  <p className="achievement-desc">{achievements.competitiveProgramming.description}</p>
                </article>

                {/* Cybersecurity */}
                <article className="achievement-card">
                  <div className="achievement-header">
                    <h3 className="achievement-title">{achievements.cybersecurity.title}</h3>
                    <span className="achievement-badge">TRYHACKME // LABS</span>
                  </div>
                  <p className="achievement-desc">{achievements.cybersecurity.description}</p>
                  <div className="achievement-tags-wrap">
                    {achievements.cybersecurity.topics.map((topic) => (
                      <span key={topic} className="achievement-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            </section>
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
