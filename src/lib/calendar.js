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

export function collectYears(days) {
  const totals = new Map();

  for (const day of days || []) {
    if (!day?.date) continue;
    const year = Number(day.date.slice(0, 4));
    totals.set(year, (totals.get(year) || 0) + (Number(day.count) || 0));
  }

  const years = [...totals.entries()]
    .filter(([, total]) => total > 0)
    .map(([year]) => year);

  const currentYear = new Date().getUTCFullYear();
  if (!years.includes(currentYear)) years.push(currentYear);

  return years.sort((a, b) => b - a);
}

export function filterDaysByYear(days, year) {
  if (!Array.isArray(days)) return [];
  if (!year) return days;

  const prefix = `${year}-`;
  return days.filter((day) => typeof day?.date === 'string' && day.date.startsWith(prefix));
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

  // Group whole week columns into months so the chart reads as months,
  // not one continuous block. A week belongs to the month of its first
  // day inside the requested range, so a year view opens on january.
  const months = [];

  for (const week of weeks) {
    const anchor = week.find((day) => day && entries.has(day.date)) || week.find(Boolean);
    if (!anchor) continue;

    const key = anchor.date.slice(0, 7);
    let month = months[months.length - 1];

    if (!month || month.key !== key) {
      month = { key, label: MONTH_LABELS[Number(key.slice(5, 7)) - 1], weeks: [] };
      months.push(month);
    }

    month.weeks.push(week);
  }

  return {
    weeks,
    months,
    total: sorted.reduce((sum, day) => sum + day.count, 0),
    activeDays: sorted.filter((day) => day.count > 0).length,
    maxDay: maxCount,
    firstDate: sorted[0].date,
    lastDate: sorted[sorted.length - 1].date
  };
}
