import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import FlowingMenu from './FlowingMenu';
import LanguagesAndSkills from './subpages/LanguagesAndSkills';
import Projects from './subpages/Projects';
import Certifications from './subpages/Certifications';
import Timeline from './subpages/Timeline';
import FieldsOfStudy from './subpages/FieldsOfStudy';
import './PageThree.css';

const demoItems = [
  { key: 'languages', link: '#', text: 'Languages and Skills', image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { key: 'projects', link: '#', text: 'Projects', image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { key: 'certifications', link: '#', text: 'Certifications', image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { key: 'timeline', link: '#', text: 'Timeline', image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { key: 'fields', link: '#', text: 'Fields of Study', image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' }
];

const SUBPAGE_COMPONENTS = {
  languages: LanguagesAndSkills,
  projects: Projects,
  certifications: Certifications,
  timeline: Timeline,
  fields: FieldsOfStudy
};

const PageThree = forwardRef(function PageThree({ onReturnToPageTwo, onSubpageStateChange }, ref) {
  const [activeSubpage, setActiveSubpage] = useState(null);
  const [transitionState, setTransitionState] = useState('idle'); // idle | expanding | open | contracting
  const originRectRef = useRef({ top: 0, height: 0 });
  const transitionBlockRef = useRef(null);
  const isBusyRef = useRef(false);

  // Forward transition: clicked row expands to fill viewport
  const handleItemClick = useCallback((index, item, rect) => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    const targetKey = item.key || demoItems[index]?.key;
    originRectRef.current = {
      top: rect.top,
      height: rect.height
    };

    setTransitionState('expanding');
    onSubpageStateChange?.(true);

    const block = transitionBlockRef.current;
    if (!block) {
      setActiveSubpage(targetKey);
      setTransitionState('open');
      isBusyRef.current = false;
      return;
    }

    gsap.killTweensOf(block);

    // Position initially at the clicked row's exact vertical position and height
    gsap.set(block, {
      top: rect.top,
      height: rect.height,
      opacity: 1,
      display: 'block'
    });

    // Animate outward until it becomes top: 0, height: 100vh
    gsap.to(block, {
      top: 0,
      height: window.innerHeight,
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        // Reveal corresponding subpage once green block fills viewport
        setActiveSubpage(targetKey);
        setTransitionState('open');
        isBusyRef.current = false;
      }
    });
  }, [onSubpageStateChange]);

  // Return transition: green block contracts back toward original row position
  const handleReturnFromSubpage = useCallback(() => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    setTransitionState('contracting');

    const block = transitionBlockRef.current;
    const savedRect = originRectRef.current;

    if (!block) {
      setActiveSubpage(null);
      setTransitionState('idle');
      onSubpageStateChange?.(false);
      isBusyRef.current = false;
      return;
    }

    gsap.killTweensOf(block);

    // Keep green block covering viewport as subpage content transitions out
    gsap.set(block, {
      top: 0,
      height: window.innerHeight,
      opacity: 1,
      display: 'block'
    });

    // Unmount subpage content so green contraction is cleanly visible
    setActiveSubpage(null);

    // Animate green block contracting back to saved row position
    gsap.to(block, {
      top: savedRect.top,
      height: savedRect.height,
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        // Contraction finishes: remove transition block and restore FlowingMenu
        gsap.set(block, { display: 'none', opacity: 0 });
        setTransitionState('idle');
        onSubpageStateChange?.(false);
        isBusyRef.current = false;
      }
    });
  }, [onSubpageStateChange]);

  useEffect(() => {
    return () => {
      if (transitionBlockRef.current) {
        gsap.killTweensOf(transitionBlockRef.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="page-three-container">
      {/* Top Header / Return to Page 2 */}
      <header className="page-three-header">
        <div className="page-three-brand">
          <span className="page-three-logo">Zeeshaan</span>
          <span className="page-three-status">WORKS // V1.0</span>
        </div>

        <button
          type="button"
          className="page-three-back-btn"
          onClick={onReturnToPageTwo}
          aria-label="Return to About page"
        >
          <span>▲</span>
          <span>RETURN TO ABOUT</span>
          <span className="page-three-back-badge">[ENTER]</span>
        </button>
      </header>

      {/* Main FlowingMenu content area */}
      <div className="page-three-menu-wrapper">
        <FlowingMenu
          items={demoItems}
          speed={15}
          textColor="#72e13e"
          bgColor="#120F17"
          marqueeBgColor="#72e13e"
          marqueeTextColor="#120F17"
          borderColor="#72e13e"
          onItemClick={handleItemClick}
          disabled={transitionState !== 'idle'}
        />
      </div>

      {/* Fixed Green Expansion Block for physical row growth/shrink */}
      <div
        ref={transitionBlockRef}
        className="page-three-transition-block"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Full-screen Destination Subpage Layer */}
      {activeSubpage && (
        <div className="page-three-subpage-layer">
          {(() => {
            const SubComponent = SUBPAGE_COMPONENTS[activeSubpage];
            return SubComponent ? <SubComponent onReturn={handleReturnFromSubpage} /> : null;
          })()}
        </div>
      )}
    </div>
  );
});

export default PageThree;
