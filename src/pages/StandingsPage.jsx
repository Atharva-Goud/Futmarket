/**
 * Standings Page
 * ===============
 * Full league standings with league selector.
 *
 * DATA ACCURACY RULES:
 *  - ALWAYS uses current season standings from football-data.org
 *  - Season and league clearly labeled
 *  - Shows "Data Unavailable" when API is unreachable
 *  - NEVER uses outdated or past-year data
 */
import { useState, useEffect } from 'react';
import { getStandings, LEAGUES } from '../services/footballApi';
import StandingsTable from '../components/StandingsTable';
import { LeagueDropdown } from '../components/LeagueSelector';
import Skeleton from '../components/Skeleton';

export default function StandingsPage() {
  const [league, setLeague] = useState('PL');
  const [standings, setStandings] = useState([]);
  const [competitionInfo, setCompetitionInfo] = useState(null);
  const [seasonInfo, setSeasonInfo] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandings() {
      setLoading(true);
      try {
        const data = await getStandings(league);
        const table = data?.standings?.[0]?.table || [];
        setStandings(table);
        setCompetitionInfo(data?.competition || null);
        setSeasonInfo(data?._season || null);
        setDataSource(data?._source || 'unavailable');
      } catch (err) {
        console.error('Failed to fetch standings:', err);
        setStandings([]);
        setDataSource('unavailable');
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, [league]);

  const leagueMeta = LEAGUES[league];

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {competitionInfo?.emblem && (
            <img src={competitionInfo.emblem} alt="" className="w-8 h-8 object-contain" />
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
            🏆 {leagueMeta?.name || 'Standings'}
          </h1>
        </div>
        <LeagueDropdown value={league} onChange={setLeague} className="text-base px-4 py-2 rounded-xl" />
      </div>

      {/* Season & Source label */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {seasonInfo && (
          <span className="text-xs font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2.5 py-1 rounded-full">
            Season {seasonInfo}
          </span>
        )}
        {dataSource && dataSource !== 'unavailable' && (
          <span className="text-[0.65rem] text-text-muted/60 font-mono">
            Data via {dataSource} · Current season only
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 flex-wrap text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-accent-green" />
          <span className="text-text-muted">Champions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-accent-blue" />
          <span className="text-text-muted">UCL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-accent-orange" />
          <span className="text-text-muted">UEL / UECL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-accent-red" />
          <span className="text-text-muted">Relegation</span>
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-6">
          <Skeleton lines={12} />
        </div>
      ) : standings.length > 0 ? (
        <div className="glass-card rounded-2xl overflow-hidden">
          <StandingsTable standings={standings} compact={false} />
        </div>
      ) : (
        <div className="glass-card rounded-2xl py-16 text-center">
          <div className="text-5xl mb-4 opacity-40">🏆</div>
          <p className="text-accent-orange text-lg font-semibold">Standings Data Unavailable</p>
          <p className="text-text-muted text-sm mt-2">
            Could not retrieve current season standings from football-data.org
          </p>
          <p className="text-text-muted text-xs mt-1">
            Please check your API token or try again later
          </p>
        </div>
      )}
    </div>
  );
}
