import { useEffect, useRef, useState } from 'react';
import { Bullets, Stack } from './EntryBits';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Scroll-reactive timeline.
 *
 * The first milestone is visible on arrival. The log then holds still while it
 * fills, so the same spacing takes twice the scrolling it used to: every pixel
 * grows the highlighted line, each milestone is revealed as the fill reaches its
 * marker, and the marker moves on (the previous one emptying out) once the next
 * one is reached. Reveals are sticky, so nothing already read disappears.
 */
export default function JourneyTimeline({ items }) {
  const runRef = useRef(null);
  const trackRef = useRef(null);
  const seenRef = useRef(0);
  const pinRef = useRef({ pace: 0, stickyTop: 120, startScroll: 0, baseline: 0 });
  const [state, setState] = useState({ active: 0, fillPx: 0 });

  useEffect(() => {
    const run = runRef.current;
    const track = trackRef.current;
    if (!run || !track) return undefined;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mountedAt = performance.now();
    let engaged = false;
    let frame = 0;

    const measureTrack = () => {
      const dots = Array.from(track.querySelectorAll('.timeline-dot'));
      const line = track.querySelector('.timeline-line');
      if (!dots.length || !line) return null;

      // The dev stylesheet lands after the first render; measure only real layout.
      if (window.getComputedStyle(dots[0]).position !== 'absolute') return null;

      const trackRect = track.getBoundingClientRect();
      const lineStart = line.getBoundingClientRect().top - trackRect.top;
      const centers = dots.map((dot) => {
        const rect = dot.getBoundingClientRect();
        return rect.top - trackRect.top + rect.height / 2;
      });

      const lineEnd = Math.max(lineStart + 1, centers[centers.length - 1]);
      return { trackRect, lineStart, centers, lineLength: lineEnd - lineStart };
    };

    const paint = (metrics, progress) => {
      const seen = reduceQuery.matches ? 1 : Math.max(seenRef.current, progress);
      seenRef.current = seen;

      const { centers, lineStart, lineLength } = metrics;
      let active = 0;
      for (let index = 0; index < centers.length; index += 1) {
        const threshold = index === 0 ? 0 : (centers[index] - lineStart) / lineLength;
        if (threshold <= seen + 0.0015) active = index;
      }

      const fillPx = Math.round(seen * lineLength * 100) / 100;
      setState((prev) => (prev.active === active && prev.fillPx === fillPx ? prev : { active, fillPx }));
    };

    const progressFor = () => {
      if (reduceQuery.matches) return 1;
      const { pace, stickyTop, startScroll, baseline } = pinRef.current;
      // Nothing opens until the visitor scrolls, so a restored scroll position or
      // the route's scroll-to-top cannot pre-fill the log.
      if (!engaged || performance.now() - mountedAt < 250) return 0;

      if (pace && baseline) {
        const runTop = run.getBoundingClientRect().top + window.scrollY;
        const pinStart = runTop - stickyTop;
        return clamp((window.scrollY - pinStart) / pace, 0, 1);
      }

      if (!baseline) return 0;
      return clamp((window.scrollY - startScroll) / baseline, 0, 1);
    };

    const render = () => {
      frame = 0;
      const metrics = measureTrack();
      if (!metrics) return;
      paint(metrics, progressFor());
    };

    // Sizing changes what "twice the old distance" means, so it re-measures.
    const layout = () => {
      const metrics = measureTrack();
      if (!metrics) return;

      const viewport = window.innerHeight;
      const naturalTrackTop = metrics.trackRect.top + window.scrollY;

      run.style.height = '';
      const naturalMax = Math.max(0, document.documentElement.scrollHeight - viewport);
      const firstDotDoc = naturalTrackTop + metrics.centers[0];

      // Where the log cannot hold still, every marker is anchored to one line on
      // screen: the fill covers exactly the marker span, so no milestone opens as
      // it is leaving the top of the viewport. The clamp keeps the first marker
      // shut until the visitor scrolls and the last one inside the page.
      const markerSpan = Math.max(160, metrics.lineLength);
      const anchorLine = Math.round(viewport * 0.62);
      const markerStart = Math.round(
        clamp(firstDotDoc - anchorLine, 0, Math.max(0, naturalMax - markerSpan))
      );

      const spanDesired = Math.max(320, metrics.lineLength + viewport * 0.28);
      const pageStart = Math.min(naturalMax, Math.max(0, firstDotDoc - viewport * 0.6));
      const baseline = Math.min(spanDesired, Math.max(0, naturalMax - pageStart));

      // Same spacing, double the scrolling the old mapping needed. That needs the
      // log to hold still, which only works where all of it fits on screen.
      const trackHeight = Math.round(metrics.trackRect.height);
      const canPin = !reduceQuery.matches && trackHeight <= viewport - 120;
      const pace = canPin ? Math.round(Math.max(240, baseline * 2)) : 0;
      const stickyTop = Math.round(Math.max(84, (viewport - trackHeight) / 2));

      pinRef.current = { pace, stickyTop, startScroll: markerStart, baseline: markerSpan };
      track.style.top = `${stickyTop}px`;
      run.style.height = pace ? `${trackHeight + pace}px` : '';

      render();
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    const relayout = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(layout);
    };

    const onScroll = () => {
      engaged = true;
      schedule();
    };

    layout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', relayout);
    reduceQuery.addEventListener('change', relayout);

    const observer = new ResizeObserver(relayout);
    observer.observe(track);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', relayout);
      reduceQuery.removeEventListener('change', relayout);
      observer.disconnect();
    };
  }, [items]);

  return (
    <div className="timeline-run" ref={runRef}>
      <div className="timeline" ref={trackRef}>
        <span className="timeline-line" aria-hidden="true">
          <span className="timeline-fill" style={{ height: `${state.fillPx}px` }} />
        </span>

        <ol className="timeline-list">
          {items.map((item, index) => {
            const revealed = index <= state.active;
            const isActive = index === state.active;
            const className = [
              'timeline-item',
              revealed ? 'is-revealed' : '',
              isActive ? 'is-active' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li className={className} key={item.id}>
                <div className="timeline-date">
                  <span>{item.date}</span>
                  {item.location ? (
                    <span className="timeline-location">{item.location}</span>
                  ) : null}
                </div>

                <span className="timeline-dot" aria-hidden="true" />

                <article className="timeline-content">
                  <div className="timeline-head">
                    <h3>{item.title}</h3>
                    <span className="timeline-state">{item.tag}</span>
                  </div>
                  {item.subtitle ? (
                    <p className="entry-sub">
                      <span className="entry-role">{item.subtitle}</span>
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="timeline-description">{item.description}</p>
                  ) : null}
                  {item.stack ? <Stack items={item.stack} /> : null}
                  {item.bullets ? <Bullets items={item.bullets} /> : null}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
