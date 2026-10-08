import { useEffect, useState } from 'react';
import { portfolioData } from '../../../data/portfolioData';
import FlexCarousel from '../../FlexCarousel/FlexCarousel';
import './SubpageShell.css';

const generateProjectCardSVG = (proj) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="840">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          background: rgba(6, 12, 7, 0.95);
          border: 4px solid rgba(114, 225, 62, 0.8);
          border-radius: 24px;
          padding: 48px;
          display: flex;
          flex-direction: column;
          font-family: ui-monospace, Consolas, monospace;
          color: #e5e7eb;
        ">
          <h2 style="font-size: 56px; color: #ffffff; text-transform: uppercase; text-shadow: 0 0 15px rgba(114, 225, 62, 0.5); margin: 0 0 16px 0;">
            ${proj.title}
          </h2>
          <div style="font-size: 24px; color: #72e13e; margin-bottom: 24px; font-weight: bold; letter-spacing: 0.05em;">
            ${proj.role} // ${proj.timeline}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px;">
            ${proj.stack.map(tech => `<span style="background: rgba(114, 225, 62, 0.1); border: 2px solid rgba(114, 225, 62, 0.3); padding: 10px 18px; border-radius: 8px; color: #72e13e; font-size: 20px;">${tech}</span>`).join('')}
          </div>
          <p style="font-size: 28px; line-height: 1.5; color: #a1a1aa; margin: 0;">
            ${proj.description}
          </p>
        </div>
      </foreignObject>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export default function Projects({ onReturn }) {
  const { personal, projects } = portfolioData;
  const [selectedProject, setSelectedProject] = useState(null);

  const carouselItems = projects.map(proj => ({
    src: generateProjectCardSVG(proj),
    title: proj.title,
    alt: proj.title
  }));

  const handleSelect = (index) => {
    setSelectedProject(projects[index]);
  };

  const handleReturnToCarousel = () => {
    setSelectedProject(null);
    const carouselContainer = document.querySelector('.flex-carousel');
    if (carouselContainer) {
      carouselContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        if (selectedProject && e.key === 'Escape') {
          e.preventDefault();
          handleReturnToCarousel();
          return;
        }
        if (!selectedProject) {
          e.preventDefault();
          onReturn?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturn, selectedProject]);

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
          onClick={selectedProject ? handleReturnToCarousel : onReturn}
          aria-label={selectedProject ? "Return to carousel" : "Return to works menu"}
        >
          <span>▲</span>
          <span>{selectedProject ? "BACK TO CAROUSEL" : "RETURN TO WORKS"}</span>
          <span className="subpage-return-badge">[ESC]</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="subpage-main" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
        
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <FlexCarousel
            items={carouselItems}
            preset="liquid"
            intro="deal"
            cardHeight={0.65}
            gap={24}
            squeeze={0.38}
            focusOnClick={false}
            captions={true}
            fit="natural"
            radius={24}
            autoplay={!selectedProject}
            interval={5}
            onSelect={handleSelect}
          />
        </div>

        {/* Project Detail Overlay */}
        <div 
          className="project-detail-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: selectedProject ? 'auto' : 'none',
            opacity: selectedProject ? 1 : 0,
            transition: 'opacity 0.6s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50,
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(12px)',
            padding: '2rem'
          }}
          onClick={selectedProject ? handleReturnToCarousel : undefined}
        >
          {selectedProject && (
            <article 
              className="project-card" 
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '850px',
                maxHeight: '90%',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(114, 225, 62, 0.15)',
                transform: selectedProject ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                margin: 'auto'
              }}
            >
              <div className="project-card-header">
                <div className="project-header-left">
                  <h2 className="project-card-title">{selectedProject.title}</h2>
                  <span className="project-role-badge">{selectedProject.role}</span>
                  <span className="project-time-badge">{selectedProject.timeline}</span>
                  {selectedProject.deployment && (
                    <span className="project-deploy-badge">{`DEPLOYED: ${selectedProject.deployment}`}</span>
                  )}
                </div>
              </div>

              <div className="project-stack-wrap">
                {selectedProject.stack.map((tech) => (
                  <span key={tech} className="project-stack-pill">{tech}</span>
                ))}
              </div>

              <p className="project-desc-p">{selectedProject.description}</p>

              <ul className="project-bullets-list">
                {selectedProject.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="project-bullet-item">
                    <span className="project-bullet-marker" aria-hidden="true">▶</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="subpage-footer">
        <span className="subpage-footer-hint">PRESS [ESC] TO RETURN</span>
      </footer>
    </div>
  );
}
