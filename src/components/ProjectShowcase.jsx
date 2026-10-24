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

function ScrambleText({ text, className, as: Tag = 'span' }) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

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
  }, [text]);

  if (prefersReducedMotion()) {
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
      return;
    }

    lockRef.current = true;
    setDecaying(true);
    timeoutRef.current = window.setTimeout(() => {
      setIndex(nextIndex);
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

        <article className="project" key={project.id}>
          <div className="project-main">
            <div className="project-topline">
              <span>{project.timeline}</span>
              <span>{project.role}</span>
            </div>

            <h3 className="project-title">
              <ScrambleText text={project.title} />
            </h3>

            <p className="project-description">
              <ScrambleText text={project.description} />
            </p>

            <Stack items={project.stack} />
            <Bullets items={project.bullets} />
          </div>

          <aside className="project-aside" aria-label="Project details">
            <div className="project-aside-block">
              <span className="field-label">deployment</span>
              <span>{project.deployment || 'not deployed'}</span>
            </div>

            <div className="project-aside-block">
              <span className="field-label">source</span>
              {project.repo ? (
                <a href={project.repo} target="_blank" rel="noreferrer">
                  repository <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className="is-muted">private</span>
              )}
            </div>
          </aside>
        </article>
      </div>
    </section>
  );
}
