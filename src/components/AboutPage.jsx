import { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import Section from './Section';
import DecodeText from './DecodeText';
import { useInView } from '../hooks/useInView';

const { personal, education, technicalSkills, certifications, achievements, fieldsOfStudy } =
  portfolioData;

const METER_CELLS = 20;

const cgpaParts = education.cgpa.match(/([\d.]+)\s*\/\s*([\d.]+)/);
const cgpaScore = cgpaParts ? cgpaParts[1] : education.cgpa;
const cgpaMax = cgpaParts ? cgpaParts[2] : '';
const cgpaPercent =
  cgpaParts && Number(cgpaParts[2]) > 0
    ? Math.round((Number(cgpaParts[1]) / Number(cgpaParts[2])) * 100)
    : 0;
const meterFilled = Math.round((cgpaPercent / 100) * METER_CELLS);

const RECORD = [
  { key: 'id', value: personal.brandName.toLowerCase() },
  { key: 'role', value: personal.headline },
  { key: 'status', value: 'open to work', status: true },
  { key: 'base', value: personal.location },
  { key: 'edu', value: `${education.institution}, ${education.location}` },
  { key: 'degree', value: education.degree },
  { key: 'term', value: education.period },
  { key: 'coursework', value: education.coursework.join(' · ') }
];

function Record() {
  const [ref, inView] = useInView({ threshold: 0.15 });

  return (
    <dl className={`record${inView ? ' is-in' : ''}`} ref={ref}>
      {RECORD.map((row, index) => (
        <div className="record-row" key={row.key} style={{ '--i': index }}>
          <dt>{row.key}</dt>
          <dd>
            {row.status ? (
              <span className="record-status" aria-hidden="true">
                ●{' '}
              </span>
            ) : null}
            {row.value}
          </dd>
        </div>
      ))}

      <div className="record-row record-row-gpa" style={{ '--i': RECORD.length }}>
        <dt>cgpa</dt>
        <dd className="record-gpa">
          <span>
            {cgpaScore} / {cgpaMax}
          </span>
          <span className="record-meter" aria-hidden="true">
            {Array.from({ length: METER_CELLS }, (unused, index) => (
              <span
                key={index}
                className={`record-cell${index < meterFilled ? ' is-on' : ''}`}
                style={{ '--i': index }}
              />
            ))}
          </span>
          <span className="record-percent" aria-hidden="true">
            {cgpaPercent}%
          </span>
        </dd>
      </div>
    </dl>
  );
}

function FieldDossiers({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);
  const [cycle, setCycle] = useState(0);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
    setCycle((current) => current + 1);
  };

  return (
    <div className="dossiers">
      {items.map((item, index) => {
        const isOpen = item.id === openId;
        const panelId = `dossier-${item.id}`;

        return (
          <div className={`dossier${isOpen ? ' is-open' : ''}`} key={item.id}>
            <h4 className="dossier-head">
              <button
                type="button"
                className="dossier-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className="dossier-index" aria-hidden="true">
                  [{String(index + 1).padStart(2, '0')}]
                </span>
                <span className="dossier-title">
                  <DecodeText text={item.title} trigger={cycle} still={!isOpen} />
                </span>
                <span className="dossier-tag">{item.tag}</span>
                <span className="dossier-sign" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h4>

            <div className="dossier-panel" id={panelId} hidden={!isOpen}>
              <p className="dossier-desc">{item.description}</p>
              <ul className="dossier-ticks">
                {item.skills.map((skill, skillIndex) => (
                  <li key={skill} style={{ '--i': skillIndex }}>
                    <span className="dossier-tick" aria-hidden="true">
                      [ ok ]
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillListing({ categories }) {
  const [ref, inView] = useInView({ threshold: 0.12 });

  return (
    <div className={`skill-listing${inView ? ' is-in' : ''}`} ref={ref}>
      {categories.map((category, groupIndex) => (
        <div className="skill-group" key={category.name}>
          <p className="skill-group-key">
            <span aria-hidden="true">&gt;</span> {category.name}
          </p>
          <ul className="skill-group-list">
            {category.skills.map((skill, index) => (
              <li key={skill} style={{ '--i': groupIndex * 4 + index }}>
                <span className="skill-tick" aria-hidden="true">
                  [ ok ]
                </span>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function VerifiedLog({ items, notes }) {
  const [ref, inView] = useInView({ threshold: 0.15 });

  return (
    <div className={`verify${inView ? ' is-in' : ''}`} ref={ref}>
      <ol className="verify-log">
        {items.map((item, index) => (
          <li className="verify-item" key={item.name} style={{ '--i': index }}>
            <span className="verify-index" aria-hidden="true">
              [{index + 1}]
            </span>
            <span className="verify-name">{item.name}</span>
            <span className="verify-issuer">{item.issuer}</span>
            <span className="verify-stamp" aria-hidden="true">
              [ verified ]
            </span>
          </li>
        ))}
      </ol>

      <div className="verify-notes">
        {notes.map((note) => (
          <p key={note.title}>
            <span className="verify-flag" aria-hidden="true">
              //
            </span>
            <span className="field-label">{note.title}</span>
            {note.description}
          </p>
        ))}
      </div>
    </div>
  );
}

const NOTES = [
  {
    title: achievements.competitiveProgramming.title,
    description: achievements.competitiveProgramming.description
  },
  {
    title: achievements.cybersecurity.title,
    description: achievements.cybersecurity.description
  }
];

export default function AboutPage() {
  return (
    <Section id="about" index="01" title="about" path="~/about">
      <div className="page-blocks">
        <section className="page-block" aria-labelledby="about-record">
          <h3 className="block-head" id="about-record">
            record
          </h3>
          <Record />
        </section>

        <section className="page-block" aria-labelledby="about-fields">
          <h3 className="block-head" id="about-fields">
            fields of study
          </h3>
          <FieldDossiers items={fieldsOfStudy} />
        </section>

        <section className="page-block" aria-labelledby="about-skills">
          <h3 className="block-head" id="about-skills">
            skills
          </h3>
          <SkillListing categories={technicalSkills.categories} />
        </section>

        <section className="page-block" aria-labelledby="about-verified">
          <h3 className="block-head" id="about-verified">
            verified
          </h3>
          <VerifiedLog items={certifications} notes={NOTES} />
        </section>
      </div>
    </Section>
  );
}
