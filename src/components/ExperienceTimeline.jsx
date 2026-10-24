import { Bullets, Stack } from './EntryBits';

export default function ExperienceTimeline({ items }) {
  const chronological = [...items].reverse();

  return (
    <ol className="timeline">
      {chronological.map((job, index) => (
        <li className="timeline-item" key={job.id}>
          <div className="timeline-date">
            <span>{job.period}</span>
            <span className="timeline-location">{job.location}</span>
          </div>

          <span
            className={`timeline-dot${index === chronological.length - 1 ? ' is-latest' : ''}`}
            aria-hidden="true"
          />

          <article className="timeline-content">
            <div className="timeline-head">
              <h3>{job.company}</h3>
              <span className="timeline-state">{index === chronological.length - 1 ? 'latest' : 'past'}</span>
            </div>
            <p className="entry-sub">
              <span className="entry-role">{job.role}</span>
            </p>
            <Stack items={job.stack} />
            <Bullets items={job.bullets} />
          </article>
        </li>
      ))}
    </ol>
  );
}
