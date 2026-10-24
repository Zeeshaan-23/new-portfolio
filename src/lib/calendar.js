export const MONTH_LABELS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
];

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function buildCalendar(days) {
  if (!Array.isArray(days) || days.length === 0) return null;

  const entries = new Map();
  for (const day of days) {
    if (!day?.date) continue;
    entries.set(day.date, {
      date: day.date,
      count: Number(day.count) || 0,
      level: Number.isInteger(day.level) ? Math.min(4, Math.max(0, day.level)) : null
    });
  }

  const sorted = [...entries.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) return null;

  const maxCount = Math.max(...sorted.map((day) => day.count), 1);
  const first = parseDate(sorted[0].date);
  const last = parseDate(sorted[sorted.length - 1].date);

  const start = new Date(first);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const weeks = [];
  let week = [];
  const cursor = new Date(start);

  while (cursor <= last) {
    const key = toIsoDate(cursor);
    const match = entries.get(key);
    week.push({
      date: key,
      count: match?.count ?? 0,
      level:
        match?.level ??
        (match?.count ? Math.max(1, Math.ceil((match.count / maxCount) * 4)) : 0)
    });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const monthLabels = [];
  let previousMonth = -1;

  weeks.forEach((currentWeek, index) => {
    const firstDay = currentWeek.find(Boolean);
    if (!firstDay) {
      monthLabels.push('');
      return;
    }

    const month = Number(firstDay.date.slice(5, 7)) - 1;
    const dayOfMonth = Number(firstDay.date.slice(8, 10));

    if (index === 0 || (month !== previousMonth && dayOfMonth <= 7)) {
      monthLabels.push(MONTH_LABELS[month]);
      previousMonth = month;
    } else {
      monthLabels.push('');
    }
  });

  return {
    weeks,
    monthLabels,
    total: sorted.reduce((sum, day) => sum + day.count, 0),
    activeDays: sorted.filter((day) => day.count > 0).length,
    maxDay: maxCount,
    firstDate: sorted[0].date,
    lastDate: sorted[sorted.length - 1].date
  };
}
