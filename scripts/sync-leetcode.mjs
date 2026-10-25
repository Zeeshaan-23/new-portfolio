import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { portfolioData } from '../src/data/portfolioData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'public', 'data', 'leetcode-activity.json');

const username =
  process.argv[2] || process.env.LEETCODE_USERNAME || portfolioData.personal.leetcode.username;

if (!username) {
  console.error(
    'No LeetCode username configured. Pass one as an argument or set personal.leetcode.username in src/data/portfolioData.js.'
  );
  process.exit(1);
}

const endpoint = 'https://leetcode.com/graphql';
const query = `
  query userActivity($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        submissionCalendar
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

async function fetchYear(year) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com'
    },
    body: JSON.stringify({ query, variables: { username, year } })
  });

  if (!response.ok) {
    throw new Error(`LeetCode request failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(' '));
  }

  if (!payload.data?.matchedUser) {
    throw new Error(`LeetCode profile "${username}" was not found.`);
  }

  return payload.data;
}

function parseCalendar(value) {
  if (!value) return {};

  try {
    const calendar = JSON.parse(value);
    return Object.fromEntries(
      Object.entries(calendar).map(([timestamp, count]) => {
        const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
        return [date, Number(count) || 0];
      })
    );
  } catch {
    return {};
  }
}

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const firstDay = new Date(today);
firstDay.setUTCDate(firstDay.getUTCDate() - 364);

const currentYear = today.getUTCFullYear();
const previousYear = firstDay.getUTCFullYear();
const years = [...new Set([previousYear, currentYear])];

const calendars = {};
const solvedCounts = {};
const questionTotals = {};

for (const year of years) {
  const { matchedUser, allQuestionsCount } = await fetchYear(year);
  Object.assign(calendars, parseCalendar(matchedUser.userCalendar?.submissionCalendar));

  for (const entry of matchedUser.submitStatsGlobal?.acSubmissionNum || []) {
    const count = Number(entry.count);
    if (Number.isFinite(count)) solvedCounts[entry.difficulty] = count;
  }

  for (const entry of allQuestionsCount || []) {
    const count = Number(entry.count);
    if (Number.isFinite(count)) questionTotals[entry.difficulty] = count;
  }
}

const solvedTotal = Number.isFinite(solvedCounts.All) ? solvedCounts.All : null;

const difficultyStat = (difficulty) => {
  const solved = solvedCounts[difficulty];
  const total = questionTotals[difficulty];
  return Number.isFinite(solved) && Number.isFinite(total) ? { solved, total } : null;
};

const problemStats = {
  total: difficultyStat('All'),
  easy: difficultyStat('Easy'),
  medium: difficultyStat('Medium'),
  hard: difficultyStat('Hard')
};

const problems = Object.values(problemStats).every(Boolean) ? problemStats : null;

const days = [];
for (const cursor = new Date(firstDay); cursor <= today; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
  const date = cursor.toISOString().slice(0, 10);
  days.push({ date, count: calendars[date] || 0 });
}

const maxCount = Math.max(...days.map((day) => day.count), 1);
const leveledDays = days.map((day) => ({
  ...day,
  level: day.count === 0 ? 0 : Math.max(1, Math.ceil((day.count / maxCount) * 4))
}));

const total = days.reduce((sum, day) => sum + day.count, 0);
const activeDays = days.filter((day) => day.count > 0).length;

const snapshot = {
  username,
  syncedAt: new Date().toISOString(),
  range: {
    start: days[0].date,
    end: days[days.length - 1].date
  },
  total,
  activeDays,
  solvedTotal,
  problems,
  days: leveledDays
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(
  `Wrote ${path.relative(root, outputPath)}: ${total} submissions across ${activeDays} active days for @${username}.`
);
