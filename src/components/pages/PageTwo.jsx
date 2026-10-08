import { forwardRef } from 'react';
import LightTunnel from '../tunnel/LightTunnel';
import ProfileCard from '../card/ProfileCard';
import profilePhoto from '../../assets/profile.jpg';
import { portfolioData } from '../../data/portfolioData';
import './PageTwo.css';

const PageTwo = forwardRef(function PageTwo({ onReturnToPageOne, onProceedToPageThree }, ref) {
  const { personal, education, experience } = portfolioData;
  const currentRole = experience.find(e => e.isCurrent);
  const previousRole = experience.find(e => !e.isCurrent);

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
          <span className="page-two-logo">{personal.shortName}</span>
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

      {/* Main Content Layout: About Me (Left) & ProfileCard (Right) */}
      <main className="page-two-main">
        <div className="page-two-grid">
          {/* Left Column: Heading & About Description */}
          <section className="about-content-col">
            <div className="about-heading-row">
              <h2 className="about-heading">About Me</h2>
              <span className="about-role-pill">{currentRole.role}</span>
            </div>

            <div className="about-text-area">
              <p className="about-bio-p">
                I am a Computer Science and Engineering student at <strong>{education.institution}</strong> (CGPA: <strong>{education.cgpa}</strong>) and currently a <strong>{currentRole.role} at {currentRole.company}</strong>, building Next.js and React applications, conducting security audits, and streamlining releases with AI-driven testing. Previously at <strong>{previousRole.company}</strong>, I engineered the multi-signer <strong>eSign Platform</strong> and configured enterprise <strong>IBM DataPower Gateways</strong>.
              </p>

              <p className="about-bio-p">
                Give me ai and half an hour and ill get it done. Outside of full-stack engineering and backend systems, I actively solve algorithmic problems on LeetCode and explore hands-on cybersecurity labs on TryHackMe.
              </p>
            </div>
          </section>

          {/* Right Column: React Bits ProfileCard */}
          <section className="about-photo-col" aria-label="Profile card section">
            <ProfileCard
              avatarUrl={profilePhoto}
              name={personal.name}
              title={currentRole.role}
              handle="Zeeshaan-23"
              showUserInfo={false}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowEnabled
              innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            />
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
