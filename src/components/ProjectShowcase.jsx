import { useEffect, useRef, useState } from 'react';
import { Bullets, Stack } from './EntryBits';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-<=>[]{}';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrambleText(text, progress) {
  return text
    .split('')
    .map((character, index) => {
      if (!/[A-Za-z0-9]/.test(character)) return character;
      if (index / text.length < progress) return character;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join('');
}

function ScrambleText({ text, className, as: Tag = 'span', trigger = 0 }) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    // A negative trigger marks a stacked project that is not on screen yet.
    if (trigger < 0 || prefersReducedMotion()) return undefined;

    let frame = 0;
    const totalFrames = 20;
    const interval = window.setInterval(() => {
      frame += 1;

      if (frame >= totalFrames) {
        setOutput(text);
        window.clearInterval(interval);
        return;
      }

      setOutput(scrambleText(text, frame / totalFrames));
    }, 24);

    return () => window.clearInterval(interval);
  }, [text, trigger]);

  if (prefersReducedMotion() || trigger < 0) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {output}
    </Tag>
  );
}

function AsciiNoise() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
    }, 45);

    return () => window.clearInterval(interval);
  }, []);

  const lines = Array.from({ length: 8 }, () =>
    Array.from({ length: 120 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('')
  );

  return (
    <div className="ascii-noise" aria-hidden="true">
      {lines.map((line, index) => (
        <span key={index}>{line}</span>
      ))}
    </div>
  );
}

export default function ProjectShowcase({ projects }) {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [decaying, setDecaying] = useState(false);
  const lockRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const changeProject = (direction) => {
    if (lockRef.current) return;

    const nextIndex = (index + direction + projects.length) % projects.length;

    if (prefersReducedMotion()) {
      setIndex(nextIndex);
      setCycle((current) => current + 1);
      return;
    }

    lockRef.current = true;
    setDecaying(true);
    timeoutRef.current = window.setTimeout(() => {
      setIndex(nextIndex);
      setCycle((current) => current + 1);
      setDecaying(false);
      lockRef.current = false;
    }, 170);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      changeProject(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      changeProject(1);
    }
  };

  const project = projects[index];
  const counter = String(index + 1).padStart(2, '0');

  return (
    <section
      className="project-showcase"
      aria-label="Selected projects"
      onKeyDown={handleKeyDown}
    >
      <div className="project-toolbar">
        <p className="project-kicker">selected work</p>

        <div className="project-controls">
          <p className="project-counter">
            <span>{counter}</span> / {String(projects.length).padStart(2, '0')}
          </p>
          <button
            type="button"
            className="project-arrow"
            onClick={() => changeProject(-1)}
            aria-label="Show previous project"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="project-arrow"
            onClick={() => changeProject(1)}
            aria-label="Show next project"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Project {index + 1} of {projects.length}: {project.title}
      </p>

      <div className="project-stage" data-state={decaying ? 'decaying' : 'ready'}>
        {decaying && <AsciiNoise />}

        {/* Every project shares one grid cell, so the stage always reserves the
            tallest one and the page never changes height when switching. */}
        {projects.map((item, itemIndex) => {
          const isActive = itemIndex === index;
          const trigger = isActive ? cycle : -1;

          return (
            <article
              key={item.id}
              className={`project${isActive ? ' is-active' : ''}`}
              aria-hidden={isActive ? undefined : 'true'}
            >
              <div className="project-main">
                <div className="project-topline">
                  <span>{item.timeline}</span>
                  <span>{item.role}</span>
                </div>

                <h3 className="project-title">
                  <ScrambleText text={item.title} trigger={trigger} />
                </h3>

                <p className="project-description">
                  <ScrambleText text={item.description} trigger={trigger} />
                </p>

                <Stack items={item.stack} />
                <Bullets items={item.bullets} />
              </div>

              <aside className="project-aside" aria-label="Project details">
                <div className="project-aside-block">
                  <span className="field-label">deployment</span>
                  <span>{item.deployment || 'not deployed'}</span>
                </div>

                <div className="project-aside-block">
                  <span className="field-label">source</span>
                  {item.repo ? (
                    <a href={item.repo} target="_blank" rel="noreferrer">
                      repository <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="is-muted">private</span>
                  )}
                </div>
              </aside>
            </article>
          );
        })}
      </div>
    </section>
  );
}
