/**
 * Scores Page
 * ============
 * Full match scores & fixtures with date navigation and league filters.
 *
 * DATA ACCURACY RULES:
 *  - Only displays matches with valid date/time
 *  - Scores shown only if real and verified
 *  - "Data Unavailable" for missing API data
 */
import { useState, useEffect } from 'react';
import { getMatchesByDate } from '../services/footballApi';
import { getDateString, formatDate } from '../utils/helpers';
import MatchCard from '../components/MatchCard';
import { LeagueChips } from '../components/LeagueSelector';
import Skeleton from '../components/Skeleton';

export default function ScoresPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [matches, setMatches] = useState([]);
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = getDateString(dayOffset);
  const displayDate =
    dayOffset === 0
      ? 'Today'
      : dayOffset === -1
      ? 'Yesterday'
      : dayOffset === 1
      ? 'Tomorrow'
      : formatDate(currentDate);

  // Fetch matches when date changes
  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const data = await getMatchesByDate(currentDate);
        setMatches(data?.matches || []);
        setDataSource(data?._source || 'unavailable');
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setMatches([]);
        setDataSource('unavailable');
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [currentDate]);

  // Filter matches by league
  const filteredMatches =
    leagueFilter === 'all'
      ? matches
      : matches.filter((m) => m.competition?.code === leagueFilter);

  // Group by competition
  const grouped = filteredMatches.reduce((acc, match) => {
    const comp = match.competition?.name || 'Other';
    if (!acc[comp]) acc[comp] = { emblem: match.competition?.emblem, matches: [] };
    acc[comp].matches.push(match);
    return acc;
  }, {});

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold">⚽ Scores & Fixtures</h1>

        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDayOffset((d) => d - 1)}
            className="w-9 h-9 rounded-lg bg-bg-card border border-white/10 text-text-secondary hover:text-accent-green hover:border-accent-green transition-all cursor-pointer text-lg flex items-center justify-center"
          >
            ←
          </button>
          <span className="font-semibold text-sm min-w-[120px] text-center">{displayDate}</span>
          <button
            onClick={() => setDayOffset((d) => d + 1)}
            className="w-9 h-9 rounded-lg bg-bg-card border border-white/10 text-text-secondary hover:text-accent-green hover:border-accent-green transition-all cursor-pointer text-lg flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>

      {/* Source + date info */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-xs text-text-muted font-mono">
          {currentDate}
        </span>
        {dataSource && dataSource !== 'unavailable' && (
          <span className="text-[0.65rem] text-text-muted/60 font-mono">
            · via {dataSource}
          </span>
        )}
      </div>

      {/* League Filter Chips */}
      <div className="mb-6">
        <LeagueChips value={leagueFilter} onChange={setLeagueFilter} includeAll />
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="glass-card rounded-2xl p-6">
          <Skeleton lines={8} />
        </div>
      ) : Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([compName, { emblem, matches: compMatches }]) => (
          <div key={compName} className="mb-8">
            {/* Competition header */}
            <div className="flex items-center gap-2 mb-3">
              {emblem && <img src={emblem} alt="" className="w-5 h-5 object-contain" />}
              <h3 className="font-display text-sm font-bold text-accent-cyan">{compName}</h3>
              <span className="text-xs text-text-muted">({compMatches.length})</span>
            </div>
            {/* Match cards – MatchCard handles date/time validation internally */}
            {compMatches.map((match) => (
              <MatchCard key={match.id} match={match} variant="full" />
            ))}
          </div>
        ))
      ) : (
        <div className="glass-card rounded-2xl py-16 text-center">
          <div className="text-5xl mb-4 opacity-40">⚽</div>
          {dataSource === 'unavailable' ? (
            <>
              <p className="text-accent-orange text-lg font-semibold">Match Data Unavailable</p>
              <p className="text-text-muted text-sm mt-2">
                Could not connect to football-data.org
              </p>
              <p className="text-text-muted text-xs mt-1">
                Please check your API token or try again later
              </p>
            </>
          ) : (
            <>
              <p className="text-text-muted text-lg">No matches found for {displayDate}</p>
              <p className="text-text-muted text-sm mt-2">Try navigating to a different date</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
