import { useEffect, useRef, useState } from 'react';

/**
 * Replaces the native pointer with an opaque disc in the boot sheet's colour, so
 * the intro collapses into it. Only mounts for fine pointers — touch devices keep
 * their own behaviour.
 */
export default function SiteCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const frameRef = useRef(0);
  const positionRef = useRef({ x: 0, y: 0 });

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

    const paint = () => {
      frameRef.current = 0;
      const { x, y } = positionRef.current;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const move = (event) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
      dot.dataset.visible = 'true';

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

  return <div className="site-cursor" ref={dotRef} aria-hidden="true" />;
}
