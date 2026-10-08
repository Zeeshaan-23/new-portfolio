import { useEffect, useMemo } from 'react';
import { portfolioData } from '../../../data/portfolioData';
import DomeGallery from '../../DomeGallery/DomeGallery';
import SkillCard from '../../DomeGallery/SkillCard';
import './SubpageShell.css';
import './LanguagesAndSkills.css';

export default function LanguagesAndSkills({ onReturn }) {
  const { personal, technicalSkills } = portfolioData;

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

  // The 5 skill categories from portfolioData
  const skillCards = useMemo(() => {
    return technicalSkills.categories.map((category, idx) => ({
      id: category.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      index: `0${idx + 1}`,
      name: category.name,
      skills: category.skills
    }));
  }, [technicalSkills.categories]);

  return (
    <div className="subpage-container" role="main" aria-label="Languages and Skills page">
      {/* Top Header */}
      <header className="subpage-header">
        <div className="subpage-brand">
          <span className="subpage-logo">{personal.shortName}</span>
          <span className="subpage-category-tag">WORKS // 01</span>
        </div>

        <div className="subpage-header-title-group">
          <h1 className="subpage-header-title">LANGUAGES AND SKILLS</h1>
          <div className="subpage-header-subtitle">INTERACTIVE 3D ARCHIVE // ROTATE TO EXPLORE</div>
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

      {/* Main 3D Dome Gallery Stage */}
      <main className="subpage-main dome-subpage-main">


        <div className="dome-gallery-container">
          <DomeGallery
            items={skillCards}
            renderItem={(card) => (
              <SkillCard
                title={card.name}
                index={card.index}
                skills={card.skills}
              />
            )}
            fit={1.4}
            minRadius={1400}
            segments={20}
            dragDampening={0.6}
            openedImageWidth={null}
            openedImageHeight={null}
            imageBorderRadius="14px"
            openedImageBorderRadius="14px"
            grayscale={false}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="subpage-footer">
        <span className="subpage-footer-hint">DRAG TO ROTATE ARCHIVE // PRESS [ESC] OR [ENTER] TO RETURN</span>
      </footer>
    </div>
  );
}
