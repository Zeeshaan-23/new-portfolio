import { portfolioData } from '../data/portfolioData';
import Section from './Section';

const { education, technicalSkills, certifications, achievements } = portfolioData;

export default function AboutPage() {
  return (
    <Section id="about" index="01" title="about" path="~/about">
      <div className="page-blocks">
        <section className="page-block" aria-labelledby="about-education">
          <h3 className="block-head" id="about-education">
            education
          </h3>
          <article className="entry entry-plain">
            <div className="entry-head">
              <h4>{education.degree}</h4>
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
        </section>

        <section className="page-block" aria-labelledby="about-skills">
          <h3 className="block-head" id="about-skills">
            skills
          </h3>
          <dl className="skill-table">
            {technicalSkills.categories.map((category) => (
              <div className="skill-row" key={category.name}>
                <dt>{category.name}</dt>
                <dd>{category.skills.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="page-block" aria-labelledby="about-credentials">
          <h3 className="block-head" id="about-credentials">
            certifications
          </h3>
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
        </section>
      </div>
    </Section>
  );
}
