/**
 * Football API Service
 * =====================
 * Uses football-data.org (free tier) for REAL, verified data ONLY.
 *
 * DATA ACCURACY RULES:
 *  - No mock, fake, or estimated data is ever returned
 *  - If the API is unavailable, methods return null/empty
 *  - Callers must handle empty states gracefully
 *  - All scores, standings, and stats are real and verified
 *
 * Free tier = 10 requests/minute.
 * Register at https://www.football-data.org/client/register for your own token.
 */

// In dev, requests go through Vite's proxy to avoid CORS.
const API_BASE = import.meta.env.DEV
  ? '/api/football'
  : 'https://api.football-data.org/v4';

// Free API token – replace with your own from football-data.org
const API_TOKEN = '43f063a5a2b04066b0b69e62c2fa81ea';

// ---------- Simple cache ----------
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ---------- Generic fetcher ----------
async function apiFetch(endpoint, params = {}) {
  const cacheKey = endpoint + JSON.stringify(params);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const base = API_BASE.startsWith('http') ? API_BASE : window.location.origin + API_BASE;
    const url = new URL(`${base}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });

    const res = await fetch(url.toString(), {
      headers: { 'X-Auth-Token': API_TOKEN },
    });

    if (!res.ok) {
      if (res.status === 429) {
        const stale = cache.get(cacheKey);
        if (stale) return stale.data;
        throw new Error('Rate limited – please wait and try again.');
      }
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`API call failed (${endpoint}):`, err.message);
    return null; // No fake fallback – callers must handle null
  }
}

// ---------- League code map ----------
export const LEAGUES = {
  PL:  { code: 'PL',  id: 2021, name: 'Premier League',   country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD:  { code: 'PD',  id: 2014, name: 'La Liga',          country: '🇪🇸' },
  BL1: { code: 'BL1', id: 2002, name: 'Bundesliga',       country: '🇩🇪' },
  SA:  { code: 'SA',  id: 2019, name: 'Serie A',           country: '🇮🇹' },
  FL1: { code: 'FL1', id: 2015, name: 'Ligue 1',          country: '🇫🇷' },
  CL:  { code: 'CL',  id: 2001, name: 'Champions League', country: '🇪🇺' },
};

// ============================================
// MATCH VALIDATION
// ============================================

/**
 * Validates that a match has required date/time information.
 * Matches without proper date/time must NOT be displayed.
 */
function isValidMatch(match) {
  if (!match) return false;
  if (!match.utcDate) return false;

  const d = new Date(match.utcDate);
  if (isNaN(d.getTime())) return false; // Invalid date

  if (!match.homeTeam?.name && !match.homeTeam?.shortName) return false;
  if (!match.awayTeam?.name && !match.awayTeam?.shortName) return false;

  return true;
}

/**
 * Filters out matches that don't meet data accuracy rules.
 */
function validateMatches(matches = []) {
  return matches.filter(isValidMatch);
}

// ============================================
// PUBLIC API METHODS (NO fallback data)
// ============================================

/**
 * Get matches for a date range.
 * Returns only validated matches with proper date/time.
 */
export async function getMatches(dateFrom, dateTo, league = '') {
  const params = { dateFrom, dateTo };
  let data;
  if (league && LEAGUES[league]) {
    data = await apiFetch(`/competitions/${league}/matches`, params);
  } else {
    data = await apiFetch('/matches', params);
  }

  if (!data) return { matches: [], _source: 'unavailable' };

  return {
    ...data,
    matches: validateMatches(data.matches),
    _source: 'football-data.org',
  };
}

export async function getTodayMatches() {
  const today = new Date().toISOString().split('T')[0];
  return getMatches(today, today);
}

export async function getMatchesByDate(date) {
  return getMatches(date, date);
}

/**
 * Get league standings.
 * Returns current season data with season/competition metadata.
 */
export async function getStandings(leagueCode = 'PL') {
  const data = await apiFetch(`/competitions/${leagueCode}/standings`);
  if (!data) return null;

  // Attach metadata for UI display
  return {
    ...data,
    _source: 'football-data.org',
    _season: data.season
      ? `${data.season.startDate?.slice(0, 4)}/${data.season.endDate?.slice(0, 4)}`
      : null,
  };
}

/**
 * Get top scorers for a league. Real data only.
 */
export async function getTopScorers(leagueCode = 'PL', limit = 10) {
  const data = await apiFetch(`/competitions/${leagueCode}/scorers`, { limit });
  if (!data?.scorers) return { scorers: [], _source: 'unavailable' };
  return { ...data, _source: 'football-data.org' };
}

export async function getTeam(teamId) {
  return apiFetch(`/teams/${teamId}`);
}

export async function getPerson(personId) {
  return apiFetch(`/persons/${personId}`);
}

export async function getCompetition(leagueCode) {
  return apiFetch(`/competitions/${leagueCode}`);
}

export async function searchTeams(query, leagueCode = 'PL') {
  const data = await apiFetch(`/competitions/${leagueCode}/teams`);
  if (!data?.teams) return [];
  const q = query.toLowerCase();
  return data.teams.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortName?.toLowerCase().includes(q) ||
      t.tla?.toLowerCase().includes(q)
  );
}
