import { useCallback, useEffect, useState } from 'react';

const CACHE_PREFIX = 'zsh.activity.v1.';
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
    total: 0,
    activeDays: 0,
    solvedTotal: null,
    syncedAt: null,
    error: null
  };
}

function useCachedActivity({ cacheKey, enabled, fetcher, errorMessage }) {
  const [cached] = useState(() => (enabled && cacheKey ? readCache(cacheKey) : null));

  const [activity, setActivity] = useState(() => {
    if (!enabled) return emptyState('unconfigured');

    if (cached) {
      return {
        ...cached,
        status: cached.total > 0 ? 'ready' : 'empty',
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
          status: payload.total > 0 ? 'ready' : 'empty',
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

  return { ...activity, reload };
}

export function useGithubActivity(username) {
  const cacheKey = username ? `${CACHE_PREFIX}github.${username.toLowerCase()}` : null;

  const fetcher = useCallback(
    async (signal) => {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
        { signal }
      );

      if (!response.ok) throw new Error(`GitHub activity request failed with ${response.status}.`);

      const data = await response.json();
      const days = normalizeDays(data.contributions);

      return {
        days,
        total: Number(data.total?.lastYear) || days.reduce((sum, day) => sum + day.count, 0),
        activeDays: days.filter((day) => day.count > 0).length,
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

export function useLeetcodeActivity(username) {
  const cacheKey = username ? `${CACHE_PREFIX}leetcode.${username.toLowerCase()}` : null;

  const fetcher = useCallback(
    async (signal) => {
      const response = await fetch(`${import.meta.env.BASE_URL}data/leetcode-activity.json`, {
        signal
      });

      if (!response.ok) throw new Error('No LeetCode activity snapshot is available.');

      const data = await response.json();
      if (data.username && data.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error('The LeetCode snapshot belongs to a different profile.');
      }

      const days = normalizeDays(data.days);

      return {
        days,
        total: Number(data.total) || days.reduce((sum, day) => sum + day.count, 0),
        activeDays: Number(data.activeDays) || days.filter((day) => day.count > 0).length,
        solvedTotal: Number.isFinite(data.solvedTotal) ? data.solvedTotal : null,
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
    errorMessage: 'LeetCode activity is temporarily unavailable.'
  });
}
