import { useEffect, useState } from 'react';
import { portfolioData } from './data/portfolioData';
import { useTheme } from './hooks/useTheme';
import profilePhoto from './assets/profile.jpg';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import ActivityDashboard from './components/ActivityDashboard';
import ExperienceTimeline from './components/ExperienceTimeline';
import ProjectShowcase from './components/ProjectShowcase';
import './App.css';

const { personal, education, experience, projects, technicalSkills, certifications, achievements } =
  portfolioData;

const SECTIONS = [
  { id: 'about', label: 'about', index: '01', path: '~/about' },
  { id: 'experience', label: 'experience', index: '02', path: '~/experience' },
  { id: 'projects', label: 'projects', index: '03', path: '~/projects' },
  { id: 'skills', label: 'skills', index: '04', path: '~/skills' },
  { id: 'education', label: 'education', index: '05', path: '~/education' },
  { id: 'certifications', label: 'certifications', index: '06', path: '~/credentials' }
];

function useActiveSection() {
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.slice(1);
    return SECTIONS.some((section) => section.id === hash) ? hash : SECTIONS[0].id;
  });

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const marker = 150;
      let current = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) {
          current = section.id;
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = SECTIONS[SECTIONS.length - 1].id;
      }

      setActiveSection((previous) => (previous === current ? previous : current));
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    const initialHash = window.location.hash.slice(1);
    const initialTarget = SECTIONS.some((section) => section.id === initialHash)
      ? document.getElementById(initialHash)
      : null;

    const initialFrame = window.requestAnimationFrame(() => {
      if (initialTarget) {
        const previousScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        initialTarget.scrollIntoView({ block: 'start' });
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      }

      updateActiveSection();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return activeSection;
}

function Section({ id, index, title, path, children }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-heading`}>
      <header className="section-head">
        <h2 id={`${id}-heading`}>
          <span className="section-index">{index}</span>
          {title}
        </h2>
        <span className="section-path" aria-hidden="true">
          {path}
        </span>
      </header>
      {children}
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="contact" aria-labelledby="contact-heading">
      <div className="content footer-inner">
        <div className="footer-intro">
          <p className="footer-kicker">contact</p>
          <h2 id="contact-heading">
            let&apos;s build something<span className="footer-cursor" aria-hidden="true">_</span>
          </h2>
          <p className="footer-tagline">
            <span aria-hidden="true">//</span> {personal.tagline}
          </p>
        </div>

        <div className="footer-links">
          <a href={`mailto:${personal.email}`}>
            <span className="footer-link-label">email</span>
            <span>{personal.email}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={personal.github.url} target="_blank" rel="noreferrer">
            <span className="footer-link-label">github</span>
            <span>{personal.github.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={personal.linkedin.url} target="_blank" rel="noreferrer">
            <span className="footer-link-label">linkedin</span>
            <span>{personal.linkedin.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="footer-base">
          <span>
            © {new Date().getFullYear()} {personal.name}
          </span>
          <span>{personal.location}</span>
          <span>EOF</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const activeSection = useActiveSection();
  const latestRole = experience[0];
  const previousRole = experience[1];

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        skip to content
      </a>

      <Topbar
        theme={theme}
        onToggleTheme={toggleTheme}
        sections={SECTIONS}
        activeSection={activeSection}
      />
      <Sidebar personal={personal} sections={SECTIONS} activeSection={activeSection} />

      <main className="main" id="main" tabIndex={-1}>
        <div className="content">
          <Section id="about" index="01" title="about" path="~/about">
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

          <Section id="experience" index="02" title="experience" path="~/experience">
            <ExperienceTimeline items={experience} />
          </Section>

          <Section id="projects" index="03" title="projects" path="~/projects">
            <ProjectShowcase projects={projects} />
          </Section>

          <Section id="skills" index="04" title="skills" path="~/skills">
            <dl className="skill-table">
              {technicalSkills.categories.map((category) => (
                <div className="skill-row" key={category.name}>
                  <dt>{category.name}</dt>
                  <dd>{category.skills.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="education" index="05" title="education" path="~/education">
            <article className="entry entry-plain">
              <div className="entry-head">
                <h3>{education.degree}</h3>
                <span className="entry-period">{education.period}</span>
              </div>
              <p className="entry-sub">
                <span className="entry-role">{education.institution}</span>
                <span className="meta-sep" aria-hidden="true">
                  /
                </span>
                {education.location}
                <span className="meta-sep" aria-hidden="true">
                  /
                </span>
                <span className="accent">CGPA {education.cgpa}</span>
              </p>
              <p className="detail-line">
                <span className="field-label">coursework</span>
                <span>{education.coursework.join(' · ')}</span>
              </p>
            </article>
          </Section>

          <Section
            id="certifications"
            index="06"
            title="certifications"
            path="~/credentials"
          >
            <ul className="plain-list">
              {certifications.map((certification) => (
                <li key={certification.name}>
                  <span>{certification.name}</span>
                  <span className="plain-list-meta">{certification.issuer}</span>
                </li>
              ))}
            </ul>

            <div className="notes">
              <p>
                <span className="field-label">{achievements.competitiveProgramming.title}</span>
                {achievements.competitiveProgramming.description}
              </p>
              <p>
                <span className="field-label">{achievements.cybersecurity.title}</span>
                {achievements.cybersecurity.description}
              </p>
            </div>
          </Section>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}
