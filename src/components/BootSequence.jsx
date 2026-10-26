import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const TARGET = 'zeeshaan@portfolio';
const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&@|~;:';
const BAR_CELLS = 22;
const LOAD_MS = 1500;
const HOLD_MS = 220;
const COLLAPSE_MS = 680;
const FADE_MS = 160;
const SCRAMBLE_MS = 70;
const SCROLL_KEYS = [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'];

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * One-shot intro: an inverted white sheet, an ASCII meter filling to 100% while
 * the identity string decrypts, then the sheet collapses radially into the
 * pointer as a small white disc.
 */
export default function BootSequence() {
  const [enabled] = useState(() => !prefersReducedMotion());
  const [phase, setPhase] = useState('boot');
  const [progress, setProgress] = useState(0);
  const [scramble, setScramble] = useState(() => TARGET.replace(/[^\s]/g, randomGlyph));
  const overlayRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  // Release the pre-paint white cover once this overlay is in the DOM.
  useLayoutEffect(() => {
    document.documentElement.classList.remove('boot-pending');
  }, []);

  // Follow the pointer so the collapse converges on wherever the cursor is.
  useEffect(() => {
    if (!enabled) return undefined;

    const track = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('pointerdown', track, { passive: true });

    return () => {
      window.removeEventListener('pointermove', track);
      window.removeEventListener('pointerdown', track);
    };
  }, [enabled]);

  // Hold the page still without touching layout, so nothing shifts when it ends.
  useEffect(() => {
    if (!enabled) return undefined;

    const stopScroll = (event) => event.preventDefault();
    const stopKeys = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (SCROLL_KEYS.includes(event.key)) event.preventDefault();
    };

    window.addEventListener('wheel', stopScroll, { passive: false });
    window.addEventListener('touchmove', stopScroll, { passive: false });
    window.addEventListener('keydown', stopKeys);

    return () => {
      window.removeEventListener('wheel', stopScroll);
      window.removeEventListener('touchmove', stopScroll);
      window.removeEventListener('keydown', stopKeys);
    };
  }, [enabled]);

  // Fill 0 -> 100, then hold the finished frame before the collapse.
  useEffect(() => {
    if (!enabled) return undefined;

    const start = performance.now();
    let frame = 0;
    let hold = 0;

    const step = (now) => {
      // The first frame can carry a timestamp slightly before `start`.
      const t = Math.min(1, Math.max(0, (now - start) / LOAD_MS));
      const eased = 1 - (1 - t) ** 2.2;
      const next = t >= 1 ? 100 : Math.round(eased * 100);

      progressRef.current = next;
      setProgress(next);

      if (t < 1) {
        frame = window.requestAnimationFrame(step);
        return;
      }

      hold = window.setTimeout(() => setPhase('collapse'), HOLD_MS);
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hold);
    };
  }, [enabled]);

  // Decrypt the identity string behind the meter; the cycling stops at 100%.
  useEffect(() => {
    if (!enabled || phase !== 'boot') return undefined;

    const id = window.setInterval(() => {
      const locked = Math.floor((progressRef.current / 100) * TARGET.length);
      let next = '';

      for (let index = 0; index < TARGET.length; index += 1) {
        next += index < locked ? TARGET[index] : randomGlyph();
      }

      setScramble(next);
    }, SCRAMBLE_MS);

    return () => window.clearInterval(id);
  }, [enabled, phase]);

  // Collapse the sheet radially toward the pointer, from every edge inward.
  useEffect(() => {
    if (phase !== 'collapse') return undefined;

    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const origin = pointerRef.current;
    const radius =
      Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      ) + 40;

    overlay.style.setProperty('--boot-x', `${origin.x}px`);
    overlay.style.setProperty('--boot-y', `${origin.y}px`);
    overlay.style.setProperty('--boot-r', `${radius}px`);

    const start = performance.now();
    let frame = 0;
    let fade = 0;

    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / COLLAPSE_MS));
      const eased = t ** 3;
      const pointer = pointerRef.current;

      overlay.style.setProperty('--boot-x', `${pointer.x}px`);
      overlay.style.setProperty('--boot-y', `${pointer.y}px`);
      overlay.style.setProperty('--boot-r', `${radius * (1 - eased)}px`);

      if (t < 1) {
        frame = window.requestAnimationFrame(step);
        return;
      }

      overlay.classList.add('is-done');
      fade = window.setTimeout(() => setPhase('done'), FADE_MS);
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fade);
    };
  }, [phase]);

  if (!enabled || phase === 'done') return null;

  const shown = Math.min(100, Math.max(0, progress));
  const filled = Math.min(BAR_CELLS, Math.max(0, Math.round((shown / 100) * BAR_CELLS)));
  const percent = `${String(shown).padStart(3, ' ')}%`;

  return (
    <div
      className={`boot-overlay${phase === 'collapse' ? ' is-collapsing' : ''}`}
      ref={overlayRef}
      aria-hidden="true"
    >
      <div className="boot-inner">
        <p className="boot-glyphs">{scramble}</p>
        <p className="boot-meter">
          <span className="boot-bar">
            <span className="boot-bracket">[</span>
            <span className="boot-bar-fill">{'\u2588'.repeat(filled)}</span>
            <span className="boot-bar-empty">{'\u2591'.repeat(BAR_CELLS - filled)}</span>
            <span className="boot-bracket">]</span>
          </span>
          <span className="boot-percent">{percent}</span>
        </p>
      </div>
    </div>
  );
}
