import { portfolioData } from '../data/portfolioData';
import Section from './Section';
import ContactForm from './ContactForm';

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

        <ContactForm email={personal.email} />
      </div>
    </Section>
  );
}
