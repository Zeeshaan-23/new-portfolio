export default function Sidebar({ personal, sections, activeSection }) {
  return (
    <aside className="sidebar">
      <div className="identity">
        <h1>{personal.name}</h1>
        <p className="identity-headline">{personal.headline}</p>
      </div>

      <div className="identity-meta">
        <p>{personal.location}</p>
        <p>
          <a href={`mailto:${personal.email}`}>{personal.email}</a>
        </p>
      </div>

      <nav className="sidenav" aria-label="Section index">
        <p className="sidenav-label">index</p>
        <ul>
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <li key={section.id}>
                <a
                  href={section.href}
                  className={isActive ? 'is-active' : undefined}
                  aria-current={isActive ? 'location' : undefined}
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

      <div className="sidebar-foot">
        <p className="sidebar-status">
          <span aria-hidden="true">●</span> open to work
        </p>
        <p className="sidebar-tagline">
          <span aria-hidden="true">//</span> {personal.tagline}
        </p>
      </div>
    </aside>
  );
}
