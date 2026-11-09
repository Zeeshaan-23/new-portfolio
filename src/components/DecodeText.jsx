import { useEffect, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-<=>[]{}';
const STEP_MS = 24;
const STEPS = 20;

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

/**
 * Renders text that decodes from glyphs. The real string always sits in a
 * visually hidden node, so assistive tech reads the words once and never the
 * noise; the scrambling copy is hidden from it.
 *
 * `trigger` replays the decode whenever it changes. A negative trigger or
 * `still` keeps the text plain (used for off-screen stacked panels).
 */
export default function DecodeText({
  text,
  className,
  as: Tag = 'span',
  trigger = 0,
  still = false
}) {
  const frozen = still || trigger < 0;
  const reduced = prefersReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (frozen || reduced) return undefined;

    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 1;

      if (frame >= STEPS) {
        setOutput(text);
        window.clearInterval(interval);
        return;
      }

      setOutput(scrambleText(text, frame / STEPS));
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, [text, trigger, frozen, reduced]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{frozen || reduced ? text : output}</span>
    </Tag>
  );
}
