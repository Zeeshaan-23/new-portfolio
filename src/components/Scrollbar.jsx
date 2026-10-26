import { useEffect, useRef, useState } from 'react';

const MIN_THUMB = 30;
const OVERFLOW_SLACK = 4;

/**
 * A themed replacement for the native scrollbar. Browsers draw their own cursor
 * over native scrollbars, so the real one is hidden and this takes its place,
 * inheriting the custom pointer. Drag and track clicks still scroll.
 */
export default function Scrollbar() {
  const [enabled, setEnabled] = useState(false);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const metricsRef = useRef({ max: 0, travel: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const apply = () => setEnabled(query.matches);

    apply();
    query.addEventListener('change', apply);

    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const root = document.documentElement;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return undefined;

    root.classList.add('has-custom-scrollbar');

    const update = () => {
      const viewport = window.innerHeight;
      const total = root.scrollHeight;
      const max = total - viewport;
      const trackHeight = track.clientHeight;

      if (max <= OVERFLOW_SLACK || trackHeight <= 0) {
        track.dataset.active = 'false';
        metricsRef.current = { max: 0, travel: 0 };
        return;
      }

      const thumbHeight = Math.min(
        trackHeight,
        Math.max(MIN_THUMB, Math.round((viewport / total) * trackHeight))
      );
      const travel = Math.max(1, trackHeight - thumbHeight);

      track.dataset.active = 'true';
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translate3d(0, ${(window.scrollY / max) * travel}px, 0)`;
      metricsRef.current = { max, travel };
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    const handleThumbDown = (event) => {
      event.preventDefault();

      const { travel } = metricsRef.current;
      if (!travel) return;

      dragRef.current = {
        id: event.pointerId,
        startY: event.clientY,
        startScroll: window.scrollY
      };
      thumb.dataset.dragging = 'true';
    };

    const handleThumbMove = (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.id) return;

      const { max, travel } = metricsRef.current;
      if (!travel) return;

      const delta = ((event.clientY - drag.startY) / travel) * max;
      window.scrollTo({ top: drag.startScroll + delta, behavior: 'instant' });
    };

    const handleThumbUp = () => {
      if (!dragRef.current) return;

      dragRef.current = null;
      thumb.dataset.dragging = 'false';
      update();
    };

    const handleTrackDown = (event) => {
      if (event.target === thumb) return;

      const { max, travel } = metricsRef.current;
      if (!travel) return;

      const trackTop = track.getBoundingClientRect().top;
      const thumbHeight = thumb.getBoundingClientRect().height;
      const target = event.clientY - trackTop - thumbHeight / 2;

      window.scrollTo({ top: (target / travel) * max, behavior: 'smooth' });
    };

    thumb.addEventListener('pointerdown', handleThumbDown);
    track.addEventListener('pointerdown', handleTrackDown);
    window.addEventListener('pointermove', handleThumbMove, { passive: true });
    window.addEventListener('pointerup', handleThumbUp);
    window.addEventListener('pointercancel', handleThumbUp);
    // A release outside the window never delivers pointerup; stop the drag there too.
    window.addEventListener('blur', handleThumbUp);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    update();

    return () => {
      root.classList.remove('has-custom-scrollbar');
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      thumb.removeEventListener('pointerdown', handleThumbDown);
      track.removeEventListener('pointerdown', handleTrackDown);
      window.removeEventListener('pointermove', handleThumbMove);
      window.removeEventListener('pointerup', handleThumbUp);
      window.removeEventListener('pointercancel', handleThumbUp);
      window.removeEventListener('blur', handleThumbUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="page-scrollbar" ref={trackRef} aria-hidden="true">
      <div className="page-scrollbar-thumb" ref={thumbRef} data-dragging="false" />
    </div>
  );
}
