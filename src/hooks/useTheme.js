import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'zsh.theme';
const THEME_COLORS = {
  dark: '#0a0c0b',
  light: '#f4f5ef'
};
const THEME_VARIABLES = [
  '--topbar-h',
  '--rail-w',
  '--content-max',
  '--gutter',
  '--bg',
  '--bg-topbar',
  '--bg-rail',
  '--bg-panel',
  '--bg-panel-strong',
  '--bg-footer',
  '--bg-hover',
  '--fg',
  '--fg-soft',
  '--fg-bright',
  '--muted',
  '--dim',
  '--faint',
  '--green',
  '--green-soft',
  '--green-deep',
  '--rule',
  '--rule-strong',
  '--selection-bg',
  '--selection-fg',
  '--shadow',
  '--mono',
  '--cal-cell',
  '--cal-gap',
  '--cal-0',
  '--cal-1',
  '--cal-2',
  '--cal-3',
  '--cal-4'
];

let activeSnapshot = null;
let rippleFrame = 0;

function getCurrentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearSnapshot() {
  window.cancelAnimationFrame(rippleFrame);
  rippleFrame = 0;

  if (activeSnapshot) {
    activeSnapshot.remove();
    activeSnapshot = null;
  }
}

function createSnapshot(originX, originY) {
  const root = document.getElementById('root');
  if (!root) return null;

  const overlay = document.createElement('div');
  overlay.className = 'theme-snapshot';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('inert', '');

  const documentStyles = window.getComputedStyle(document.documentElement);
  for (const variable of THEME_VARIABLES) {
    overlay.style.setProperty(variable, documentStyles.getPropertyValue(variable));
  }

  overlay.style.setProperty('--ripple-x', `${originX}px`);
  overlay.style.setProperty('--ripple-y', `${originY}px`);
  overlay.style.setProperty('--ripple-r', '0px');
  overlay.style.colorScheme = getCurrentTheme();

  const clone = root.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));

  const sourcePhoto = root.querySelector('.about-photo img');
  const clonePhoto = clone.querySelector('.about-photo img');
  if (sourcePhoto && clonePhoto) {
    clonePhoto.style.filter = window.getComputedStyle(sourcePhoto).filter;
  }

  clone.style.width = '100%';
  clone.style.marginTop = `${-window.scrollY}px`;

  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  return overlay;
}

function runRipple(overlay, originX, originY) {
  const radius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  );
  const duration = 640;
  const start = window.performance.now();

  const frame = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    overlay.style.setProperty('--ripple-r', `${radius * eased}px`);

    if (progress < 1) {
      rippleFrame = window.requestAnimationFrame(frame);
      return;
    }

    clearSnapshot();
  };

  rippleFrame = window.requestAnimationFrame(frame);
}

export function useTheme() {
  const [theme, setTheme] = useState(getCurrentTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable in private mode; the current session still works.
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', THEME_COLORS[theme]);
  }, [theme]);

  const toggleTheme = useCallback(
    (event) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      const bounds = event?.currentTarget?.getBoundingClientRect();
      const originX = event?.clientX || (bounds ? bounds.left + bounds.width / 2 : window.innerWidth - 44);
      const originY = event?.clientY || (bounds ? bounds.top + bounds.height / 2 : 28);

      const applyTheme = () => {
        document.documentElement.dataset.theme = nextTheme;
        flushSync(() => setTheme(nextTheme));
      };

      clearSnapshot();

      if (prefersReducedMotion()) {
        applyTheme();
        return;
      }

      const overlay = createSnapshot(originX, originY);
      applyTheme();

      if (!overlay) return;

      activeSnapshot = overlay;
      runRipple(overlay, originX, originY);
    },
    [theme]
  );

  return { theme, toggleTheme };
}

export default useTheme;
