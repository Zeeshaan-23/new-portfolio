import { useCallback, useEffect, useState } from 'react';
import { collectYears } from '../lib/calendar';

const CACHE_PREFIX = 'zsh.activity.v2.';
const CACHE_TTL = 10 * 60 * 1000;

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (!cached?.fetchedAt || Date.now() - cached.fetchedAt > CACHE_TTL) return null;
    return cached;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A full or blocked storage area should not stop the chart from rendering.
  }
}

function normalizeDays(days) {
  return (days || [])
    .filter((day) => day && typeof day.date === 'string')
    .map((day) => ({
      date: day.date,
      count: Number(day.count) || 0,
      level: Number.isInteger(day.level) ? day.level : undefined
    }));
}

function emptyState(status) {
  return {
    status,
    days: [],
    years: [],
    solvedTotal: null,
    problems: null,
    syncedAt: null,
    error: null
  };
}

function readProblems(source) {
  const pick = (solved, total) => (Number.isFinite(Number(solved)) && Number.isFinite(Number(total))
    ? { solved: Number(solved), total: Number(total) }
    : null);

  const problems = {
    total: pick(source?.totalSolved, source?.totalQuestions),
    easy: pick(source?.easySolved, source?.totalEasy),
    medium: pick(source?.mediumSolved, source?.totalMedium),
    hard: pick(source?.hardSolved, source?.totalHard)
  };

  return Object.values(problems).every(Boolean) ? problems : null;
}

function useCachedActivity({ cacheKey, enabled, fetcher, errorMessage }) {
  const [cached] = useState(() => (enabled && cacheKey ? readCache(cacheKey) : null));

  const [activity, setActivity] = useState(() => {
    if (!enabled) return emptyState('unconfigured');

    if (cached) {
      return {
        ...cached,
        status: cached.days?.length ? 'ready' : 'empty',
        error: null
      };
    }

    return emptyState('loading');
  });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!enabled || !cacheKey) return undefined;
    if (requestVersion === 0 && cached) return undefined;

    const controller = new AbortController();
    let active = true;

    fetcher(controller.signal)
      .then((payload) => {
        if (!active) return;
        writeCache(cacheKey, payload);
        setActivity({
          ...emptyState('ready'),
          ...payload,
          status: payload.days?.length ? 'ready' : 'empty',
          error: null
        });
      })
      .catch((error) => {
        if (!active || error.name === 'AbortError') return;
        setActivity({ ...emptyState('error'), error: errorMessage });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [cacheKey, cached, enabled, errorMessage, fetcher, requestVersion]);

  const reload = useCallback(() => {
    setActivity((current) => ({ ...current, status: 'loading', error: null }));
    setRequestVersion((current) => current + 1);
  }, []);

  const years = Array.isArray(activity.years) && activity.years.length > 0
    ? activity.years
    : collectYears(activity.days);

  return { ...activity, years, reload };
}

export function useGithubActivity(username) {
  const cacheKey = username ? `${CACHE_PREFIX}github.${username.toLowerCase()}` : null;

  const fetcher = useCallback(
    async (signal) => {
      // `y=all` returns every year the account has, so year switching needs no extra request.
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=all`,
        { signal }
      );

      if (!response.ok) throw new Error(`GitHub activity request failed with ${response.status}.`);

      const data = await response.json();
      const days = normalizeDays(data.contributions);

      return {
        days,
        years: collectYears(days),
        fetchedAt: Date.now()
      };
    },
    [username]
  );

  return useCachedActivity({
    cacheKey,
    enabled: Boolean(username),
    fetcher,
    errorMessage: 'GitHub contribution activity could not be loaded. Check the connection and try again.'
  });
}

// LeetCode only reports active days, so pad the range out to whole calendar years
// to keep every month column in place.
function expandToYears(calendarMap) {
  const dates = Object.keys(calendarMap).sort();
  if (dates.length === 0) return [];

  const firstYear = Number(dates[0].slice(0, 4));
  const lastYear = Number(dates[dates.length - 1].slice(0, 4));
  const start = new Date(Date.UTC(firstYear, 0, 1));
  const end = new Date(Date.UTC(lastYear, 11, 31));

  const days = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10);
    days.push({ date, count: calendarMap[date] || 0 });
  }

  const maxCount = Math.max(...days.map((day) => day.count), 1);

  return days.map((day) => ({
    ...day,
    level: day.count === 0 ? 0 : Math.max(1, Math.ceil((day.count / maxCount) * 4))
  }));
}

export function useLeetcodeActivity(username) {
  const cacheKey = username ? `${CACHE_PREFIX}leetcode.${username.toLowerCase()}` : null;

  const fetcher = useCallback(
    async (signal) => {
      // 1. Live client-side fetch via public CORS-enabled LeetCode API
      try {
        const liveResponse = await fetch(
          `https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(username)}`,
          { signal }
        );

        if (liveResponse.ok) {
          const data = await liveResponse.json();
          if (data && !data.errors && data.submissionCalendar) {
            const rawCalendar = data.submissionCalendar;
            const parsedCalendar =
              typeof rawCalendar === 'string' ? JSON.parse(rawCalendar) : rawCalendar;

            const calendarMap = {};
            for (const [timestamp, count] of Object.entries(parsedCalendar)) {
              const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
              calendarMap[date] = (calendarMap[date] || 0) + (Number(count) || 0);
            }

            const days = expandToYears(calendarMap);
            const solvedTotal = Number.isFinite(data.totalSolved)
              ? data.totalSolved
              : data.matchedUserStats?.acSubmissionNum?.find((s) => s.difficulty === 'All')?.count ?? null;

            return {
              days,
              years: collectYears(days),
              solvedTotal,
              problems: readProblems(data),
              syncedAt: null,
              fetchedAt: Date.now()
            };
          }
        }
      } catch (liveError) {
        if (liveError.name === 'AbortError') throw liveError;
        // Fall back gracefully to local snapshot if live API is temporarily unreachable
      }

      // 2. Fallback: local snapshot if available
      const response = await fetch(`${import.meta.env.BASE_URL}data/leetcode-activity.json`, {
        signal
      });

      if (!response.ok) throw new Error('No LeetCode activity data is available.');

      const data = await response.json();
      if (data.username && data.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error('The LeetCode snapshot belongs to a different profile.');
      }

      const days = normalizeDays(data.days);

      return {
        days,
        years: collectYears(days),
        solvedTotal: Number.isFinite(data.solvedTotal) ? data.solvedTotal : null,
        problems: readProblems(data.problems),
        syncedAt: data.syncedAt || null,
        fetchedAt: Date.now()
      };
    },
    [username]
  );

  return useCachedActivity({
    cacheKey,
    enabled: Boolean(username),
    fetcher,
    errorMessage: 'LeetCode activity is temporarily unavailable. Check the connection and try again.'
  });
}
