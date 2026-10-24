export function Stack({ items }) {
  return (
    <p className="detail-line">
      <span className="field-label">stack</span>
      <span>{items.join(' · ')}</span>
    </p>
  );
}

export function Bullets({ items }) {
  return (
    <ul className="bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
