import React from 'react';
import './SkillCard.css';

/**
 * SkillCard Component
 * Futuristic CRT terminal panel displaying skills for a single category on the 3D Dome.
 *
 * @param {Object} props
 * @param {string} props.title - Category title (e.g. LANGUAGES)
 * @param {string} props.index - Category index string (e.g. "01")
 * @param {Array<string>} props.skills - List of skill names
 */
export default function SkillCard({ title, index, skills = [] }) {
  return (
    <div className="dome-skill-card" role="article" aria-label={`Skill Category: ${title}`}>
      {/* Top Terminal Status Header */}
      <div className="dome-card-header">
        <div className="dome-card-header-left">
          <span className="dome-card-status-dot" aria-hidden="true" />
          <span className="dome-card-index">{`// 0${index}`}</span>
        </div>
        <span className="dome-card-count-badge">{`${skills.length} MODULES`}</span>
      </div>

      {/* Main Category Title in Cefagu font */}
      <div className="dome-card-title-group">
        <h2 className="dome-card-title">{title}</h2>
        <div className="dome-card-divider" aria-hidden="true" />
      </div>

      {/* Skills Grid */}
      <div className="dome-card-skills-grid">
        {skills.map((skill, sIdx) => (
          <div key={sIdx} className="dome-skill-pill">
            <span className="dome-skill-marker" aria-hidden="true">›</span>
            <span className="dome-skill-text">{skill}</span>
          </div>
        ))}
      </div>

      {/* Bottom Technical Decals */}
      <div className="dome-card-footer" aria-hidden="true">
        <span className="dome-card-decal-left">SYSTEM.CAPABILITY</span>
        <span className="dome-card-decal-right">[ACTIVE]</span>
      </div>
    </div>
  );
}
