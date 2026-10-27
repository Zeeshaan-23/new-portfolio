import { useEffect } from 'react';
import { portfolioData } from './data/portfolioData';
import { useTheme } from './hooks/useTheme';
import { useRoute } from './hooks/useRoute';
import profilePhoto from './assets/profile.jpg';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Section from './components/Section';
import ActivityDashboard from './components/ActivityDashboard';
import AboutPage from './components/AboutPage';
import WorkPage from './components/WorkPage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';
import BootSequence from './components/BootSequence';
import SiteCursor from './components/SiteCursor';
import Scrollbar from './components/Scrollbar';
import './App.css';

const { personal, education, experience } = portfolioData;

const NAV = [
  { id: 'about', label: 'about', index: '01', href: '#/about' },
  { id: 'work', label: 'work', index: '02', href: '#/work' },
  { id: 'gallery', label: 'gallery', index: '03', href: '#/gallery' },
  { id: 'contact', label: 'contact', index: '04', href: '#/contact' }
];

function HomePage() {
  const latestRole = experience[0];
  const previousRole = experience[1];

  return (
    <Section id="home" title="home" path="~/home">
      <div className="about-layout">
        <div className="prose">
          <p>
            I am a computer science student at <strong>{education.institution}</strong> and a
            full-stack developer. I build React and Next.js interfaces, Django APIs, and the
            systems behind them.
          </p>
          <p>
            Most recently, I interned at <strong>{latestRole.company}</strong> on Bhojpatra&apos;s
            booking frontend and security audit. Before that, I built an e-signature platform
            at <strong>{previousRole.company}</strong>.
          </p>

          <a
            className="resume-link"
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open resume PDF in a new tab"
          >
            <span className="resume-link-prompt" aria-hidden="true">$</span>
            open resume.pdf
            <span className="resume-link-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <figure className="about-photo">
          <img
            src={profilePhoto}
            width="260"
            height="320"
            alt={`Portrait of ${personal.name}`}
          />
        </figure>
      </div>

      <ActivityDashboard github={personal.github} leetcode={personal.leetcode} />
    </Section>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const route = useRoute();

  const page =
    route === 'about' || route === 'work' || route === 'gallery' || route === 'contact'
      ? route
      : 'home';
  const activeSection = route === 'home' ? undefined : route;

  // Every route is a full page now, so each one starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  return (
    <div className="app">
      <BootSequence />
      <SiteCursor />
      <Scrollbar />

      <a className="skip-link" href="#main">
        skip to content
      </a>

      <Topbar
        theme={theme}
        onToggleTheme={toggleTheme}
        sections={NAV}
        activeSection={activeSection}
      />
      <Sidebar personal={personal} sections={NAV} activeSection={activeSection} />

      <main className="main" id="main" tabIndex={-1}>
        {page === 'home' && (
          <div className="content">
            <HomePage />
          </div>
        )}

        {page === 'about' && (
          <div className="content">
            <AboutPage />
          </div>
        )}

        {page === 'work' && (
          <div className="content">
            <WorkPage />
          </div>
        )}

        {page === 'gallery' && (
          <div className="content">
            <GalleryPage />
          </div>
        )}

        {page === 'contact' && (
          <div className="content">
            <ContactPage />
          </div>
        )}
      </main>
    </div>
  );
}
