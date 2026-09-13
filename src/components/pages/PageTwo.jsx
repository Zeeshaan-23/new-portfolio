import { forwardRef } from 'react';
import LightTunnel from '../tunnel/LightTunnel';
import './PageTwo.css';

const PageTwo = forwardRef(function PageTwo({ onReturnToPageOne, onProceedToPageThree }, ref) {
  return (
    <div ref={ref} className="page-two-container">
      {/* Background: Full-viewport LightTunnel */}
      <div className="page-two-bg-canvas" aria-hidden="true">
        <LightTunnel
          cableColor="#72e13e"
          pulseColor="#72e13e"
          tunnelColor="#72e13e"
          tunnelOpacity={0.33}
          speed={0.1}
          flowDirection="outward"
          pulseSpeed={1}
          pulseLength={0.12}
          pulseBlend={1}
          pulseWidth={1}
          cableCount={25}
          thickness={0.44}
          rimWidth={0.44}
          waviness={0.3}
          sway={0.5}
          size={0.8}
          centerX={0.0}
          centerY={0.0}
          glow={0.65}
          fadeNear={0.31}
          fadeFar={2}
          brightness={0.8}
          colorVariance={true}
          grain={true}
          grainIntensity={0.17}
          opacity={0.41}
          mouseInteraction={false}
          mouseStrength={0}
        />
      </div>

      {/* Top Header / Navigation */}
      <header className="page-two-header">
        <div className="page-two-brand">
          <span className="page-two-logo">Zeeshaan</span>
          <span className="page-two-status">ABOUT // V1.0</span>
        </div>

        <div className="page-two-nav-actions">
          <button
            type="button"
            className="page-two-back-btn"
            onClick={onReturnToPageOne}
            aria-label="Return to terminal background"
          >
            <span>▲</span>
            <span>RETURN TO TERMINAL</span>
          </button>

          <button
            type="button"
            className="page-two-next-btn"
            onClick={onProceedToPageThree}
            aria-label="Proceed to works menu"
          >
            <span>WORKS</span>
            <span className="page-two-btn-badge">[ENTER]</span>
            <span>▼</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout: About Me (Left) & Reserved Photo (Right) */}
      <main className="page-two-main">
        <div className="page-two-grid">
          {/* Left Column: Heading & Clear Text Area */}
          <section className="about-content-col">
            <h2 className="about-heading">About Me</h2>
            <div className="about-text-area">
              <p className="about-placeholder-text">
                [Biography and background text will be placed here.]
              </p>
            </div>
          </section>

          {/* Right Column: Reserved Photo Slot */}
          <section className="about-photo-col" aria-label="Reserved photo section">
            <div className="about-photo-container">
              <div className="about-photo-slot">
                <span className="about-photo-indicator">PHOTO // RESERVED SLOT</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Explore cue pill at bottom */}
      <div className="page-two-footer-cue">
        <button
          type="button"
          className="page-two-explore-pill"
          onClick={onProceedToPageThree}
          aria-label="Proceed to works and skills"
        >
          <span>CONTINUE TO WORKS</span>
          <span className="page-two-explore-badge">[ENTER]</span>
          <span className="page-two-explore-arrow">▼</span>
        </button>
      </div>
    </div>
  );
});

export default PageTwo;
