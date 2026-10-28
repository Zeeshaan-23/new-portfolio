import { portfolioData } from '../data/portfolioData';
import Section from './Section';
import JourneyTimeline from './JourneyTimeline';
import ProjectShowcase from './ProjectShowcase';

const { origin, education, experience, projects } = portfolioData;

const journey = [
  {
    id: 'origin',
    date: origin.date,
    tag: 'origin',
    title: origin.title,
    subtitle: origin.subtitle,
    description: origin.description
  },
  {
    id: 'btech',
    date: 'Aug 2024',
    tag: 'education',
    title: education.institution,
    subtitle: education.degree,
    location: education.location,
    description: `${education.period} · CGPA ${education.cgpa}`
  },
  ...experience
    .slice()
    .reverse()
    .map((job) => ({
      id: job.id,
      date: job.period,
      tag: 'internship',
      title: job.company,
      subtitle: job.role,
      location: job.location,
      description: job.description,
      stack: job.stack,
      bullets: job.bullets
    }))
];

export default function WorkPage() {
  return (
    <Section id="work" index="02" title="work" path="~/work">
      <div className="page-blocks">
        <section className="page-block" aria-labelledby="work-timeline">
          <h3 className="block-head" id="work-timeline">
            timeline
          </h3>
          <JourneyTimeline items={journey} />
        </section>

        <section className="page-block" aria-labelledby="work-projects">
          <h3 className="block-head" id="work-projects">
            projects
          </h3>
          <ProjectShowcase projects={projects} />
        </section>
      </div>
    </Section>
  );
}
