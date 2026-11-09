import { portfolioData } from '../data/portfolioData';

const { personal } = portfolioData;

const LINKS = [
  {
    key: 'github',
    label: 'github',
    text: personal.github.label,
    href: personal.github.url,
    external: true
  },
  {
    key: 'email',
    label: 'email',
    text: personal.email,
    href: `mailto:${personal.email}`
  },
  {
    key: 'linkedin',
    label: 'linkedin',
    text: personal.linkedin.label,
    href: personal.linkedin.url,
    external: true
  }
];

/**
 * The one place the contact links live, carried across every route.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-command">
          <span className="footer-user">zeeshaan@portfolio</span>
          <span className="footer-prompt">:~$</span> cat contact.json
        </p>

        <ul className="footer-links">
          {LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="footer-link-label">{link.label}</span>
                <span className="footer-link-text">{link.text}</span>
                <span className="footer-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="footer-base">
          <span>
            © {new Date().getFullYear()} {personal.name}
          </span>
          <span>{personal.location}</span>
          <span>EOF</span>
        </p>
      </div>
    </footer>
  );
}
