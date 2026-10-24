import { useEffect, useState } from 'react';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2.1M12 19.4v2.1M2.5 12h2.1M19.4 12h2.1M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20.2 14.5A8.2 8.2 0 0 1 9.5 3.8 8.3 8.3 0 1 0 20.2 14.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
    </svg>
  );
}

export default function Topbar({ theme, onToggleTheme, sections, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="topbar">
        <p className="topbar-command" aria-label="Terminal identity">
          <span className="topbar-user">zeeshaan@portfolio</span>
          <span className="topbar-prompt">:~$</span>
          <span className="topbar-cmd"> whoami</span>
        </p>

        <div className="topbar-actions">
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-toggle-icon" aria-hidden="true">
              <MenuIcon />
            </span>
          </button>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
            <span className="theme-toggle-text" aria-hidden="true">
              [{nextTheme}]
            </span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="topbar-menu" id="site-menu">
          <nav className="sidenav" aria-label="Section index">
            <p className="sidenav-label">index</p>
            <ul>
              {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={isActive ? 'is-active' : undefined}
                      aria-current={isActive ? 'location' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="sidenav-index">{section.index}</span>
                      <span className="sidenav-name">{section.label}</span>
                      <span className="sidenav-mark" aria-hidden="true">
                        {isActive ? '●' : ''}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
