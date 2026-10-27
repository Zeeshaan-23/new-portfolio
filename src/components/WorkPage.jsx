import { portfolioData } from '../data/portfolioData';
import Section from './Section';
import ExperienceTimeline from './ExperienceTimeline';
import ProjectShowcase from './ProjectShowcase';

const { experience, projects } = portfolioData;

export default function WorkPage() {
  return (
    <Section id="work" index="02" title="work" path="~/work">
      <div className="page-blocks">
        <section className="page-block" aria-labelledby="work-experience">
          <h3 className="block-head" id="work-experience">
            experience
          </h3>
          <ExperienceTimeline items={experience} />
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
