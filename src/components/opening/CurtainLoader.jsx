import { useState, useRef, useCallback, useEffect } from 'react';
import './CurtainLoader.css';

/**
 * CurtainLoader Component
 *
 * Remains fully closed on initial page load.
 * Displays "Zeeshaan's Portfolio" and "Portfolio" painted directly onto the 5 curtain panels.
 * The text is clipped across the five individual panels so each panel carries its slice
 * of the text upward when lifting.
 *
 * Click anywhere triggers the opening sequence:
 * 1. BAR 3 (Center)
 * 2. BAR 2 + BAR 4 (Inner)
 * 3. BAR 1 + BAR 5 (Outer)
 *
 * @param {Object} props
 * @param {() => void} [props.onComplete] Callback invoked once the final curtain bars finish lifting
 */
export default function CurtainLoader({ onComplete }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsCompleted(true);
    if (typeof onComplete === 'function') {
      onComplete();
    }
  }, [onComplete]);

  const handleClick = useCallback(() => {
    // Only trigger once; ignore subsequent clicks
    if (isOpening || isCompleted || completedRef.current) return;

    // Accessibility: immediate completion if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleComplete();
      return;
    }

    setIsOpening(true);

    // Fallback timer: Group 3 finishes at 300ms + 700ms = 1000ms (+ 150ms buffer)
    setTimeout(() => {
      handleComplete();
    }, 1150);
  }, [isOpening, isCompleted, handleComplete]);

  // Global keyboard listener so pressing Enter anywhere opens the curtain
  useEffect(() => {
    if (isCompleted || isOpening) return;

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCompleted, isOpening, handleClick]);

  // When BAR 1 (final group) finishes its animation
  const handleFinalGroupAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    handleComplete();
  };

  if (isCompleted) {
    return null;
  }

  // Sliced text component rendered inside each panel so it moves directly with that panel
  const renderPanelTextSlice = () => (
    <div className="curtain-bar-content">
      <div className="curtain-text-wrapper">
        <h1 className="curtain-title-main">Zeeshaan's Portfolio</h1>
        <p className="curtain-title-sub">Portfolio</p>
      </div>
    </div>
  );

  return (
    <div
      className={`curtain-loader-overlay ${isOpening ? 'is-opening' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label="Click anywhere to enter Zeeshaan's Portfolio"
    >
      {/* 5 Vertical Black Curtain Panels with painted text slices */}
      <div className="curtain-bars" aria-hidden="true">
        {/* GROUP 3: BAR 1 */}
        <div
          className="curtain-bar curtain-bar-1"
          onAnimationEnd={handleFinalGroupAnimationEnd}
        >
          {renderPanelTextSlice()}
        </div>

        {/* GROUP 2: BAR 2 */}
        <div className="curtain-bar curtain-bar-2">
          {renderPanelTextSlice()}
        </div>

        {/* GROUP 1: BAR 3 (Center - lifts first) */}
        <div className="curtain-bar curtain-bar-3">
          {renderPanelTextSlice()}
        </div>

        {/* GROUP 2: BAR 4 */}
        <div className="curtain-bar curtain-bar-4">
          {renderPanelTextSlice()}
        </div>

        {/* GROUP 3: BAR 5 */}
        <div className="curtain-bar curtain-bar-5">
          {renderPanelTextSlice()}
        </div>
      </div>
    </div>
  );
}
