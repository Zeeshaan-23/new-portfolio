const SIZE = 120;
const RADIUS = 47;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SEGMENT_GAP = 3;

const DIFFICULTIES = [
  { key: 'easy', label: 'easy' },
  { key: 'medium', label: 'med.' },
  { key: 'hard', label: 'hard' }
];

function readStats(problems, key) {
  const entry = problems?.[key];
  const solved = Number(entry?.solved);
  const total = Number(entry?.total);
  if (!Number.isFinite(solved) || !Number.isFinite(total) || total <= 0) return null;
  return { solved: Math.min(solved, total), total };
}

export default function LeetcodeSummary({ problems }) {
  const overall = readStats(problems, 'total');
  const rows = DIFFICULTIES.map((difficulty) => ({
    ...difficulty,
    stats: readStats(problems, difficulty.key)
  }));

  if (!overall || rows.some((row) => !row.stats)) return null;

  const solvedSum = rows.reduce((sum, row) => sum + row.stats.solved, 0) || 1;

  const cumulative = rows.reduce((acc, row) => {
    const previous = acc.length ? acc[acc.length - 1] : 0;
    return [...acc, previous + (row.stats.solved / solvedSum) * CIRCUMFERENCE];
  }, []);

  const segments = rows.map((row, index) => {
    const start = index === 0 ? 0 : cumulative[index - 1];
    const share = cumulative[index] - start;

    return {
      key: row.key,
      offset: start,
      length: Math.max(share - SEGMENT_GAP, 1)
    };
  });

  return (
    <aside className="leetcode-summary" aria-label="Total problems solved">
      <div className="lq-ring">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="lq-ring-svg"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className="lq-ring-track"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth="6"
          />
          {segments.map((segment) => (
            <circle
              key={segment.key}
              className={`lq-ring-arc lq-ring-arc-${segment.key}`}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="butt"
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          ))}
        </svg>

        <div className="lq-ring-center">
          <p className="lq-ring-count">
            <span className="lq-ring-solved">{overall.solved}</span>
            <span className="lq-ring-total">/{overall.total}</span>
          </p>
          <p className="lq-ring-caption">solved</p>
        </div>
      </div>

      <ul className="lq-breakdown">
        {rows.map((row) => (
          <li key={row.key}>
            <span className={`lq-swatch lq-swatch-${row.key}`} aria-hidden="true" />
            <span className="lq-difficulty">{row.label}</span>
            <span className="lq-fraction">
              {row.stats.solved}
              <span className="lq-fraction-sep" aria-hidden="true">
                /
              </span>
              {row.stats.total}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
