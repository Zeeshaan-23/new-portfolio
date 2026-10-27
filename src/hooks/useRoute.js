import { useEffect, useState } from 'react';

export const ROUTES = ['about', 'work', 'gallery', 'contact'];

function parseHash() {
  const raw = window.location.hash
    .replace(/^#/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();

  return ROUTES.includes(raw) ? raw : 'home';
}

/**
 * Hash-driven page state. Home is the default landing page; every other value
 * maps to one destination in the navigation index.
 */
export function useRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash());

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

export default useRoute;
