import { forwardRef } from 'react';
import FlowingMenu from './FlowingMenu';
import './PageThree.css';

const demoItems = [
  { link: '#', text: 'Languages and Skills', image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Projects', image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Certifications', image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Timeline', image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' },
  { link: '#', text: 'Fields of Study', image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format' }
];

const PageThree = forwardRef(function PageThree({ onReturnToPageTwo }, ref) {
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
        />
      </div>
    </div>
  );
});

export default PageThree;
