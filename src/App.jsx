import { useState, useRef, useCallback, useEffect } from 'react';
import CurtainLoader from './components/opening/CurtainLoader';
import FaultyTerminal from './components/terminal/FaultyTerminal';
import PageTwo from './components/pages/PageTwo';
import PageThree from './components/pages/PageThree';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState(1);
  const [isCurtainActive, setIsCurtainActive] = useState(true);
  const isTransitioningRef = useRef(false);
  const pageTwoRef = useRef(null);
  const pageThreeRef = useRef(null);
  const touchStartYRef = useRef(0);

  const activePageRef = useRef(activePage);
  activePageRef.current = activePage;

  const isCurtainActiveRef = useRef(isCurtainActive);
  isCurtainActiveRef.current = isCurtainActive;

  const isSubpageActiveRef = useRef(false);

  const handleSubpageStateChange = useCallback((active) => {
    isSubpageActiveRef.current = active;
  }, []);

  const goToPage = useCallback((targetPage) => {
    const target = Math.min(3, Math.max(1, targetPage));
    if (isTransitioningRef.current || isSubpageActiveRef.current || target === activePageRef.current) return;

    isTransitioningRef.current = true;
    activePageRef.current = target;
    setActivePage(target);

    // Release transition lock after animation settles (900ms duration)
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 920);
  }, []);

  const handleCurtainComplete = useCallback(() => {
    isCurtainActiveRef.current = false;
    setIsCurtainActive(false);
  }, []);

  // Wheel and trackpad gesture coordinator across 3 pages
  const handleWheel = useCallback((e) => {
    if (isTransitioningRef.current || isSubpageActiveRef.current) return;

    const current = activePageRef.current;
    if (e.deltaY > 30) {
      // Forward scroll
      if (current === 1) {
        goToPage(2);
      } else if (current === 2) {
        goToPage(3);
      }
    } else if (e.deltaY < -30) {
      // Backward scroll
      if (current === 3) {
        goToPage(2);
      } else if (current === 2) {
        goToPage(1);
      }
    }
  }, [goToPage]);

  // Keyboard navigation coordinator across 3 pages (Enter, Arrows, Page keys)
  const handleKeyDown = useCallback((e) => {
    if (isTransitioningRef.current || isSubpageActiveRef.current) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const isEnter = e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter';

    if (isEnter) {
      if (isCurtainActiveRef.current) return;
      e.preventDefault();
      const current = activePageRef.current;
      if (e.shiftKey) {
        // Shift+Enter navigates backward
        if (current === 3) goToPage(2);
        else if (current === 2) goToPage(1);
      } else {
        // Enter navigates forward in cycle: 1 -> 2 -> 3 -> 1
        if (current === 1) goToPage(2);
        else if (current === 2) goToPage(3);
        else if (current === 3) goToPage(1);
      }
      return;
    }

    const current = activePageRef.current;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      if (current === 1) goToPage(2);
      else if (current === 2) goToPage(3);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (current === 3) goToPage(2);
      else if (current === 2) goToPage(1);
    }
  }, [goToPage]);

  // Touch gesture coordinator for mobile / trackpads
  const handleTouchStart = useCallback((e) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioningRef.current || isSubpageActiveRef.current) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    const current = activePageRef.current;

    if (deltaY > 50) {
      // Swipe up: forward
      if (current === 1) goToPage(2);
      else if (current === 2) goToPage(3);
    } else if (deltaY < -50) {
      // Swipe down: backward
      if (current === 3) goToPage(2);
      else if (current === 2) goToPage(1);
    }
  }, [goToPage]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  return (
    <div
      className="app-container"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Initial Opening Curtain Ceremony */}
      <CurtainLoader onComplete={handleCurtainComplete} />

      {/* ==================================================
          PAGE 1: Base Terminal Layer (Always remains mounted behind)
          ================================================== */}
      <div
        className={`page-one-wrapper ${activePage >= 2 ? 'is-inactive' : ''} ${activePage === 3 ? 'is-deep' : ''}`}
        aria-hidden={activePage !== 1}
      >
        <FaultyTerminal
          scale={1.7}
          gridMul={[2, 1]}
          digitSize={1.3}
          timeScale={1.1}
          pause={false}
          scanlineIntensity={0.9}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.11}
          tint="#45f031"
          mouseReact={true}
          mouseStrength={0.2}
          pageLoadAnimation={false}
          brightness={0.5}
          overlayText={{
            line1: 'Building Fast,',
            line2: 'Shipping even Faster'
          }}
        />

        {/* Accessible screen-reader headline for Page 1 */}
        <div className="page-one-hero-accessible sr-only" aria-label="Hero Title">
          <h1>
            <span>Building Fast,</span>
            <span>Shipping even Faster</span>
          </h1>
        </div>

        {/* Explore cue button on Page 1 */}
        {activePage === 1 && (
          <button
            type="button"
            className="page-one-explore-btn"
            onClick={() => goToPage(2)}
            aria-label="Scroll, click, or press Enter to view About page"
          >
            <span>EXPLORE ABOUT</span>
            <span className="page-one-explore-badge">[ENTER]</span>
            <span className="page-one-explore-arrow">▼</span>
          </button>
        )}
      </div>

      {/* ==================================================
          PAGE 2: Stacked Middle Layer (About Me with LightTunnel)
          ================================================== */}
      <div
        className={`page-two-wrapper ${activePage >= 2 ? 'is-active' : ''} ${activePage === 3 ? 'is-inactive' : ''}`}
        aria-hidden={activePage !== 2}
      >
        <PageTwo
          ref={pageTwoRef}
          onReturnToPageOne={() => goToPage(1)}
          onProceedToPageThree={() => goToPage(3)}
        />
      </div>

      {/* ==================================================
          PAGE 3: Stacked Top Layer (FlowingMenu)
          ================================================== */}
      <div
        className={`page-three-wrapper ${activePage === 3 ? 'is-active' : ''}`}
        aria-hidden={activePage !== 3}
      >
        <PageThree
          ref={pageThreeRef}
          onReturnToPageTwo={() => goToPage(2)}
          onSubpageStateChange={handleSubpageStateChange}
        />
      </div>
    </div>
  );
}
