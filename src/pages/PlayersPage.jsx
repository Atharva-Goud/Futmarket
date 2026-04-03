/**
 * Players Page (Top Scorers + Stats)
 * ====================================
 * Shows top scorers from verified API data only.
 *
 * DATA ACCURACY RULES:
 *  - All stats are from football-data.org (real, verified)
 *  - No fake or estimated stats
 *  - Shows "Data Unavailable" when API is unreachable
 */
import { useState, useEffect } from 'react';
import { getTopScorers, LEAGUES } from '../services/footballApi';
import { LeagueDropdown } from '../components/LeagueSelector';
import Skeleton from '../components/Skeleton';
import { useSearchParams } from 'react-router-dom';

export default function PlayersPage() {
  const [league, setLeague] = useState('PL');
  const [scorers, setScorers] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    async function fetchScorers() {
      setLoading(true);
      try {
        const data = await getTopScorers(league, 20);
        setScorers(data?.scorers || []);
        setDataSource(data?._source || 'unavailable');
      } catch (err) {
        console.error('Failed to fetch scorers:', err);
        setScorers([]);
        setDataSource('unavailable');
      } finally {
        setLoading(false);
      }
    }
    fetchScorers();
  }, [league]);

  // Filter by search query
  const filtered = searchQuery
    ? scorers.filter(
        (s) =>
          s.player?.name?.toLowerCase().includes(searchQuery) ||
          s.team?.name?.toLowerCase().includes(searchQuery) ||
          s.team?.shortName?.toLowerCase().includes(searchQuery)
      )
    : scorers;

  const leagueMeta = LEAGUES[league];

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold">👟 Player Stats</h1>
        <LeagueDropdown value={league} onChange={setLeague} className="text-base px-4 py-2 rounded-xl" />
      </div>

      {/* Source attribution */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {dataSource && dataSource !== 'unavailable' && (
          <span className="text-[0.65rem] text-text-muted/60 font-mono">
            All stats verified via {dataSource}
          </span>
        )}
      </div>

      {searchQuery && (
        <div className="mb-6 text-sm text-text-muted">
          Searching for: <span className="text-accent-green font-semibold">"{searchQuery}"</span>
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-2xl p-6">
          <Skeleton lines={10} />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s, i) => {
            const isMbappe =
              s.player?.name?.toLowerCase().includes('mbappé') ||
              s.player?.name?.toLowerCase().includes('mbappe');

            return (
              <div
                key={s.player?.id || i}
                className={`
                  glass-card rounded-2xl p-5 transition-all duration-400
                  hover:-translate-y-1 hover:shadow-lg
                  ${isMbappe ? 'border-france-blue/40 bg-[linear-gradient(145deg,rgba(0,35,149,0.15)_0%,rgba(20,27,45,0.9)_100%)] hover:shadow-[0_0_30px_rgba(0,35,149,0.2)]' : 'hover:border-white/15'}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className={`font-display font-black text-3xl ${i < 3 ? 'text-accent-yellow' : 'text-text-muted/30'}`}>
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isMbappe && <span className="text-xs">⭐🇫🇷</span>}
                      <h3 className={`font-display font-bold text-lg truncate ${isMbappe ? 'text-accent-green' : ''}`}>
                        {s.player?.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {s.team?.crest && (
                        <img src={s.team.crest} alt="" className="w-4 h-4 object-contain" />
                      )}
                      <span className="text-sm text-text-muted">
                        {s.team?.shortName || s.team?.name}
                      </span>
                      {s.player?.nationality && (
                        <span className="text-xs text-text-muted/60">
                          · {s.player.nationality}
                        </span>
                      )}
                    </div>

                    {/* Stats grid – real verified data only */}
                    <div className="grid grid-cols-4 gap-3">
                      <StatBox label="Goals" value={s.goals ?? s.numberOfGoals ?? '—'} highlight />
                      <StatBox label="Assists" value={s.assists ?? '—'} />
                      <StatBox label="Played" value={s.playedMatches ?? '—'} />
                      <StatBox label="Penalties" value={s.penalties ?? '—'} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl py-16 text-center">
          <div className="text-5xl mb-4 opacity-40">👟</div>
          {searchQuery ? (
            <>
              <p className="text-text-muted text-lg">No players found matching "{searchQuery}"</p>
            </>
          ) : (
            <>
              <p className="text-accent-orange text-lg font-semibold">Player Data Unavailable</p>
              <p className="text-text-muted text-sm mt-2">
                Could not retrieve scorer data from football-data.org
              </p>
              <p className="text-text-muted text-xs mt-1">
                Please check your API token or try again later
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Small stat box – displays verified data only, "—" if unavailable */
function StatBox({ label, value, highlight = false }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`font-display font-extrabold text-xl ${highlight ? 'gradient-text' : 'text-text-primary'}`}>
        {value}
      </span>
      <span className="text-[0.6rem] text-text-muted uppercase tracking-wider">{label}</span>
    </div>
  );
}
