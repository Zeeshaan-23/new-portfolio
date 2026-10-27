import { portfolioData } from '../data/portfolioData';
import Section from './Section';

const { gallery } = portfolioData;
const base = import.meta.env.BASE_URL;

export default function GalleryPage() {
  return (
    <Section id="gallery" index="03" title="gallery" path="~/gallery">
      <ul className="gallery-grid">
        {gallery.map((item, index) => {
          const source = encodeURI(`${base}${item.src}`);

          return (
            <li key={item.id}>
              <a className="gallery-item" href={source} target="_blank" rel="noreferrer">
                <span className="gallery-frame">
                  <img src={source} alt={item.alt} width="1600" height="1000" loading="lazy" />
                </span>
                <span className="gallery-caption">
                  <span className="gallery-caption-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item.label}</span>
                  <span className="gallery-caption-arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
