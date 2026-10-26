import { useEffect, useRef, useState } from 'react';

const INTERACTIVE =
  'a[href], button:not([disabled]), [role="button"], select, textarea, input, summary, label';

/** Time constant for the pointer follow, in ms. Smaller snaps harder. */
const FOLLOW_MS = 28;

/**
 * Replaces the native pointer with an opaque disc in the boot sheet's colour, so
 * the intro collapses into it. The disc trails the pointer very slightly and
 * opens into a ring over anything clickable. Fine pointers only.
 */
export default function SiteCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const frameRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const primedRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const apply = () => setEnabled(query.matches);

    apply();
    query.addEventListener('change', apply);

    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const dot = dotRef.current;
    const root = document.documentElement;
    if (!dot) return undefined;

    root.classList.add('has-custom-cursor');

    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastFrame = 0;

    const paint = (now) => {
      const target = targetRef.current;
      const position = positionRef.current;
      const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 16.7;
      lastFrame = now;

      if (instant) {
        position.x = target.x;
        position.y = target.y;
      } else {
        // Frame-rate independent easing, so the disc keeps the same weight at 60 or 144Hz.
        const factor = 1 - Math.exp(-elapsed / FOLLOW_MS);
        position.x += (target.x - position.x) * factor;
        position.y += (target.y - position.y) * factor;
      }

      const settled =
        Math.abs(target.x - position.x) < 0.15 && Math.abs(target.y - position.y) < 0.15;

      if (settled) {
        position.x = target.x;
        position.y = target.y;
      }

      dot.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;

      if (settled) {
        frameRef.current = 0;
        lastFrame = 0;
        return;
      }

      frameRef.current = window.requestAnimationFrame(paint);
    };

    const move = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY };

      if (!primedRef.current) {
        primedRef.current = true;
        positionRef.current = { ...targetRef.current };
      }

      dot.dataset.visible = 'true';

      const hover =
        event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;

      if (hover !== hoverRef.current) {
        hoverRef.current = hover;
        dot.dataset.hover = hover ? 'true' : 'false';
      }

      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(paint);
    };

    const hide = () => {
      dot.dataset.visible = 'false';
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="site-cursor" ref={dotRef} aria-hidden="true">
      <span className="site-cursor-dot" />
    </div>
  );
}
