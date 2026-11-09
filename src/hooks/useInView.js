import { useEffect, useRef, useState } from 'react';

/**
 * Flips to true the first time the element is on screen and stays there, so
 * entrance effects never replay while the visitor scrolls back up.
 */
export function useInView({ threshold = 0.2, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const supported = typeof IntersectionObserver !== 'undefined';
  const [inView, setInView] = useState(!supported);

  useEffect(() => {
    const node = ref.current;
    if (!node || !supported) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, supported]);

  return [ref, inView];
}

export default useInView;
