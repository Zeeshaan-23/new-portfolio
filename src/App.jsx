import { useState, useRef, useCallback, useEffect } from 'react';
import CurtainLoader from './components/opening/CurtainLoader';
import FaultyTerminal from './components/terminal/FaultyTerminal';
import PageTwo from './components/pages/PageTwo';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState(1);
  const [isCurtainActive, setIsCurtainActive] = useState(true);
  const isTransitioningRef = useRef(false);
  const pageTwoRef = useRef(null);
  const touchStartYRef = useRef(0);

  const activePageRef = useRef(activePage);
  activePageRef.current = activePage;

  const isCurtainActiveRef = useRef(isCurtainActive);
  isCurtainActiveRef.current = isCurtainActive;

  const goToPage = useCallback((targetPage) => {
    if (isTransitioningRef.current || targetPage === activePageRef.current) return;

    isTransitioningRef.current = true;
    activePageRef.current = targetPage;
    setActivePage(targetPage);

    // Release transition lock after animation settles (900ms duration)
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 920);
  }, []);

  const handleCurtainComplete = useCallback(() => {
    isCurtainActiveRef.current = false;
    setIsCurtainActive(false);
  }, []);

  // Wheel and trackpad gesture coordinator
  const handleWheel = useCallback((e) => {
    if (isTransitioningRef.current) return;

    const current = activePageRef.current;
    if (current === 1 && e.deltaY > 30) {
      goToPage(2);
    } else if (current === 2 && e.deltaY < -30) {
      // Only transition back if Page 2 is scrolled to the top
      const pageTwoEl = pageTwoRef.current;
      if (pageTwoEl && pageTwoEl.scrollTop <= 5) {
        goToPage(1);
      }
    }
  }, [goToPage]);

  // Keyboard navigation coordinator (Arrow keys, Page keys, and Enter key)
  const handleKeyDown = useCallback((e) => {
    if (isTransitioningRef.current) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const isEnter = e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter';

    // Enter key scrolls/advances through each page once the curtain has opened
    if (isEnter) {
      if (isCurtainActiveRef.current) return;
      e.preventDefault();
      const current = activePageRef.current;
      if (current === 1) {
        goToPage(2);
      } else if (current === 2) {
        goToPage(1);
      }
      return;
    }

    const current = activePageRef.current;
    if (current === 1 && (e.key === 'ArrowDown' || e.key === 'PageDown')) {
      e.preventDefault();
      goToPage(2);
    } else if (current === 2 && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
      const pageTwoEl = pageTwoRef.current;
      if (pageTwoEl && pageTwoEl.scrollTop <= 5) {
        e.preventDefault();
        goToPage(1);
      }
    }
  }, [goToPage]);

  // Touch gesture coordinator for mobile / trackpads
  const handleTouchStart = useCallback((e) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioningRef.current) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    const current = activePageRef.current;

    if (current === 1 && deltaY > 50) {
      goToPage(2);
    } else if (current === 2 && deltaY < -50) {
      const pageTwoEl = pageTwoRef.current;
      if (pageTwoEl && pageTwoEl.scrollTop <= 5) {
        goToPage(1);
      }
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
          PAGE 1: Base Terminal Layer (Remains visually behind Page 2)
          ================================================== */}
      <div
        className={`page-one-wrapper ${activePage === 2 ? 'is-inactive' : ''}`}
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
        />

        {/* Explore cue button on Page 1 */}
        {activePage === 1 && (
          <button
            type="button"
            className="page-one-explore-btn"
            onClick={() => goToPage(2)}
            aria-label="Scroll, click, or press Enter to view portfolio works"
          >
            <span>EXPLORE PORTFOLIO</span>
            <span className="page-one-explore-badge">[ENTER]</span>
            <span className="page-one-explore-arrow">▼</span>
          </button>
        )}
      </div>

      {/* ==================================================
          PAGE 2: Stacked Foreground Layer (Enters from bottom over Page 1)
          ================================================== */}
      <div
        className={`page-two-wrapper ${activePage === 2 ? 'is-active' : ''}`}
        aria-hidden={activePage !== 2}
      >
        <PageTwo
          ref={pageTwoRef}
          onReturnToPageOne={() => goToPage(1)}
        />
      </div>
    </div>
  );
}
