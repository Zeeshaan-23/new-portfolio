import { portfolioData } from '../data/portfolioData';
import Section from './Section';

const { personal } = portfolioData;

export default function ContactPage() {
  return (
    <Section id="contact" index="04" title="contact" path="~/contact">
      <div className="contact-block">
        <h3 className="contact-lede">
          let&apos;s build something
          <span className="contact-cursor" aria-hidden="true">
            _
          </span>
        </h3>
        <p className="contact-tagline">
          <span aria-hidden="true">//</span> {personal.tagline}
        </p>

        <div className="contact-links">
          <a href={`mailto:${personal.email}`}>
            <span className="contact-link-label">email</span>
            <span>{personal.email}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={personal.github.url} target="_blank" rel="noreferrer">
            <span className="contact-link-label">github</span>
            <span>{personal.github.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={personal.linkedin.url} target="_blank" rel="noreferrer">
            <span className="contact-link-label">linkedin</span>
            <span>{personal.linkedin.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="contact-base">
          <span>
            © {new Date().getFullYear()} {personal.name}
          </span>
          <span>{personal.location}</span>
          <span>EOF</span>
        </div>
      </div>
    </Section>
  );
}
