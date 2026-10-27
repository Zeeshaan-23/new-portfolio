export default function Section({ id, index, title, path, children }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-heading`}>
      <header className="section-head">
        <h2 id={`${id}-heading`}>
          {index ? <span className="section-index">{index}</span> : null}
          {title}
        </h2>
        {path ? (
          <span className="section-path" aria-hidden="true">
            {path}
          </span>
        ) : null}
      </header>
      {children}
    </section>
  );
}
