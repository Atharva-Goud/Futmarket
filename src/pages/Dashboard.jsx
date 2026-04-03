/**
 * Dashboard Page (Home)
 * ======================
 * Main hub with verified, real-time data.
 *
 * DATA ACCURACY RULES:
 *  - All data comes from verified API sources
 *  - "Data Unavailable" shown when API is unreachable
 *  - No fake/estimated scores, standings, or stats
 *  - Season & data source clearly labeled
 */
import { useState, useEffect } from 'react';
import { getTodayMatches, getTopScorers, getStandings } from '../services/footballApi';
import { getFootballNews } from '../services/newsApi';
import { getRandomFact, getRandomInsights } from '../utils/funFacts';
import { getDateString, isLive } from '../utils/helpers';
import MatchCard from '../components/MatchCard';
import NewsCard from '../components/NewsCard';
import StandingsTable from '../components/StandingsTable';
import InsightCard from '../components/InsightCard';
import FunFact from '../components/FunFact';
import { LeagueDropdown } from '../components/LeagueSelector';
import Skeleton from '../components/Skeleton';
import { useToast } from '../components/Toast';

/** Small badge showing data source */
function DataSourceBadge({ source, season }) {
  if (!source || source === 'unavailable') return null;
  return (
    <span className="text-[0.55rem] text-text-muted/60 font-mono">
      via {source}{season ? ` · ${season}` : ''}
    </span>
  );
}

/** "Data Unavailable" empty state */
function DataUnavailable({ icon = '📊', message = 'Data Unavailable', subtitle }) {
  return (
    <div className="text-center py-10">
      <div className="text-3xl mb-3 opacity-40">{icon}</div>
      <p className="text-accent-orange text-sm font-semibold">{message}</p>
      {subtitle && <p className="text-text-muted text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

export default function Dashboard() {
  // State
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [standings, setStandings] = useState([]);
  const [scorersLeague, setScorersLeague] = useState('PL');
  const [standingsLeague, setStandingsLeague] = useState('PL');
  const [fact, setFact] = useState(getRandomFact());
  const [insights, setInsights] = useState(getRandomInsights(2));
  const [seasonInfo, setSeasonInfo] = useState(null);
  const [dataSource, setDataSource] = useState({
    matches: null,
    scorers: null,
    standings: null,
  });
  const [loading, setLoading] = useState({
    matches: true,
    news: true,
    scorers: true,
    standings: true,
  });

  const { addToast } = useToast();

  // Fetch matches
  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading((p) => ({ ...p, matches: true }));
        const today = getDateString(0);
        const pastDay = getDateString(-1);
        const nextDay = getDateString(1);
        let data;
        try {
          data = await getTodayMatches();
        } catch {
          const { getMatches } = await import('../services/footballApi');
          data = await getMatches(pastDay, nextDay);
        }
        setMatches(data?.matches || []);
        setDataSource((p) => ({ ...p, matches: data?._source || null }));
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        addToast('Could not load live match data', 'error');
        setDataSource((p) => ({ ...p, matches: 'unavailable' }));
      } finally {
        setLoading((p) => ({ ...p, matches: false }));
      }
    }
    fetchMatches();
  }, []);

  // Fetch news
  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading((p) => ({ ...p, news: true }));
        const articles = await getFootballNews(5);
        setNews(articles);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading((p) => ({ ...p, news: false }));
      }
    }
    fetchNews();
  }, []);

  // Fetch top scorers (when league changes)
  useEffect(() => {
    async function fetchScorers() {
      try {
        setLoading((p) => ({ ...p, scorers: true }));
        const data = await getTopScorers(scorersLeague, 10);
        setScorers(data?.scorers || []);
        setDataSource((p) => ({ ...p, scorers: data?._source || null }));
      } catch (err) {
        console.error('Failed to fetch scorers:', err);
        setDataSource((p) => ({ ...p, scorers: 'unavailable' }));
      } finally {
        setLoading((p) => ({ ...p, scorers: false }));
      }
    }
    fetchScorers();
  }, [scorersLeague]);

  // Fetch standings (when league changes)
  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading((p) => ({ ...p, standings: true }));
        const data = await getStandings(standingsLeague);
        const table = data?.standings?.[0]?.table || [];
        setStandings(table);
        setSeasonInfo(data?._season || null);
        setDataSource((p) => ({ ...p, standings: data?._source || null }));
      } catch (err) {
        console.error('Failed to fetch standings:', err);
        setDataSource((p) => ({ ...p, standings: 'unavailable' }));
      } finally {
        setLoading((p) => ({ ...p, standings: false }));
      }
    }
    fetchStandings();
  }, [standingsLeague]);

  // Sort matches: live first, then by date
  const sortedMatches = [...matches].sort((a, b) => {
    if (isLive(a.status) && !isLive(b.status)) return -1;
    if (!isLive(a.status) && isLive(b.status)) return 1;
    return new Date(a.utcDate) - new Date(b.utcDate);
  });

  const featuredMatch = sortedMatches[0];
  const liveCount = matches.filter((m) => isLive(m.status)).length;

  // Check if Mbappé is in scorers (real data only)
  const mbappeScorer = scorers.find(
    (s) => s.player?.name?.toLowerCase().includes('mbappé') || s.player?.name?.toLowerCase().includes('mbappe')
  );

  // Featured match score display
  const featuredHasScore = featuredMatch &&
    featuredMatch.score?.fullTime?.home !== null &&
    featuredMatch.score?.fullTime?.home !== undefined &&
    featuredMatch.score?.fullTime?.away !== null &&
    featuredMatch.score?.fullTime?.away !== undefined &&
    (featuredMatch.status === 'FINISHED' || isLive(featuredMatch.status));

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      {/* ─── Ticker Bar ─── */}
      <div className="glass-card rounded-xl px-4 py-2.5 mb-6 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-card to-transparent z-10 pointer-events-none" />
        <div className="flex gap-12 animate-[ticker_40s_linear_infinite] whitespace-nowrap">
          {liveCount > 0 && (
            <span className="text-sm text-text-secondary font-medium">
              🔴 <span className="text-accent-red font-semibold">{liveCount}</span> matches live now
            </span>
          )}
          <span className="text-sm text-text-secondary font-medium">
            ⚽ <span className="text-accent-green font-semibold">{matches.length}</span> matches today
          </span>
          <span className="text-sm text-text-secondary font-medium">
            🏆 Top 5 European leagues covered
          </span>
          <span className="text-sm text-text-secondary font-medium">
            🇫🇷 France & Mbappé spotlight active
          </span>
          <span className="text-sm text-text-secondary font-medium">
            🧠 AI-powered tactical insights
          </span>
          <span className="text-sm text-text-secondary font-medium">
            📡 All data sourced from football-data.org
          </span>
          {/* Duplicate for seamless loop */}
          {liveCount > 0 && (
            <span className="text-sm text-text-secondary font-medium">
              🔴 <span className="text-accent-red font-semibold">{liveCount}</span> matches live now
            </span>
          )}
          <span className="text-sm text-text-secondary font-medium">
            ⚽ <span className="text-accent-green font-semibold">{matches.length}</span> matches today
          </span>
          <span className="text-sm text-text-secondary font-medium">
            🏆 Top 5 European leagues covered
          </span>
        </div>
      </div>

      {/* ─── Featured Match ─── */}
      {featuredMatch && (
        <div className="glass-card rounded-2xl px-8 py-8 mb-8 relative overflow-hidden group hover:border-accent-green/30 hover:shadow-[0_0_30px_rgba(0,245,160,0.15)] transition-all duration-500">
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,245,160,0.08)_0%,transparent_60%)] pointer-events-none" />

          <div className="absolute top-4 left-4 bg-gradient-to-r from-accent-orange to-accent-red text-white text-[0.65rem] font-bold tracking-wider px-3 py-1 rounded-full">
            🔥 FEATURED MATCH
          </div>

          <div className="flex items-center justify-center gap-8 sm:gap-16 pt-6">
            {/* Home */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              {featuredMatch.homeTeam?.crest ? (
                <img src={featuredMatch.homeTeam.crest} alt="" className="w-16 h-16 object-contain drop-shadow-lg" />
              ) : (
                <span className="text-5xl">🏠</span>
              )}
              <span className="font-display font-bold text-center">
                {featuredMatch.homeTeam?.shortName || featuredMatch.homeTeam?.name || 'TBD'}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2">
              {featuredHasScore ? (
                <div className="flex items-center gap-4">
                  <span className="font-display font-black text-4xl sm:text-5xl gradient-text">
                    {featuredMatch.score.fullTime.home}
                  </span>
                  <span className="font-display font-black text-3xl text-text-muted">:</span>
                  <span className="font-display font-black text-4xl sm:text-5xl gradient-text">
                    {featuredMatch.score.fullTime.away}
                  </span>
                </div>
              ) : featuredMatch.status === 'SCHEDULED' || featuredMatch.status === 'TIMED' ? (
                <div className="flex items-center gap-4">
                  <span className="font-display font-black text-4xl sm:text-5xl text-text-muted">-</span>
                  <span className="font-display font-black text-3xl text-text-muted">:</span>
                  <span className="font-display font-black text-4xl sm:text-5xl text-text-muted">-</span>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-accent-orange text-sm font-semibold">Score Unavailable</p>
                </div>
              )}
              <span className={`text-xs font-semibold uppercase tracking-widest ${
                isLive(featuredMatch.status)
                  ? 'text-accent-red animate-pulse'
                  : 'text-accent-green'
              }`}>
                {isLive(featuredMatch.status) ? '● LIVE' : featuredMatch.status}
              </span>
              <span className="text-xs text-text-muted">
                {featuredMatch.competition?.name}
              </span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              {featuredMatch.awayTeam?.crest ? (
                <img src={featuredMatch.awayTeam.crest} alt="" className="w-16 h-16 object-contain drop-shadow-lg" />
              ) : (
                <span className="text-5xl">🏟️</span>
              )}
              <span className="font-display font-bold text-center">
                {featuredMatch.awayTeam?.shortName || featuredMatch.awayTeam?.name || 'TBD'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Dashboard Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card: Live & Recent Scores */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-400 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <div>
              <h2 className="font-display font-bold">⚽ Live & Recent</h2>
              <DataSourceBadge source={dataSource.matches} />
            </div>
            {liveCount > 0 && (
              <span className="text-[0.6rem] font-bold tracking-wider px-2.5 py-1 rounded-full bg-accent-red/20 text-accent-red border border-accent-red/30 animate-[pulse-glow_2s_ease-in-out_infinite]">
                LIVE
              </span>
            )}
          </div>
          <div className="px-4 py-2 max-h-[380px] overflow-y-auto">
            {loading.matches ? (
              <Skeleton lines={5} />
            ) : sortedMatches.length > 0 ? (
              sortedMatches.slice(0, 8).map((match) => (
                <MatchCard key={match.id} match={match} variant="compact" />
              ))
            ) : (
              <DataUnavailable
                icon="⚽"
                message={dataSource.matches === 'unavailable' ? 'Data Unavailable' : 'No matches today'}
                subtitle={dataSource.matches === 'unavailable'
                  ? 'Could not connect to football-data.org'
                  : 'Check back later for upcoming fixtures'}
              />
            )}
          </div>
        </div>

        {/* Card: Top Scorers */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-400 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <div>
              <h2 className="font-display font-bold">👟 Top Scorers</h2>
              <DataSourceBadge source={dataSource.scorers} />
            </div>
            <LeagueDropdown value={scorersLeague} onChange={setScorersLeague} />
          </div>
          <div className="px-5 py-2 max-h-[380px] overflow-y-auto">
            {loading.scorers ? (
              <Skeleton lines={6} />
            ) : scorers.length > 0 ? (
              scorers.map((s, i) => {
                const isMbappe =
                  s.player?.name?.toLowerCase().includes('mbappé') ||
                  s.player?.name?.toLowerCase().includes('mbappe');
                return (
                  <div
                    key={s.player?.id || i}
                    className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-b-0"
                  >
                    <span
                      className={`font-display font-extrabold text-base min-w-[24px] text-center ${
                        i < 3 ? 'text-accent-yellow' : 'text-text-muted'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm truncate ${isMbappe ? 'text-accent-green' : 'text-text-primary'}`}>
                        {isMbappe && '⭐ '}{s.player?.name}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {s.team?.shortName || s.team?.name}
                      </div>
                    </div>
                    <div className="font-display font-extrabold text-xl gradient-text min-w-[36px] text-center">
                      {s.goals ?? s.numberOfGoals ?? 0}
                    </div>
                  </div>
                );
              })
            ) : (
              <DataUnavailable
                icon="👟"
                message="Data Unavailable"
                subtitle="Could not retrieve scorer data from football-data.org"
              />
            )}
          </div>
        </div>

        {/* Card: News */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-400 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <h2 className="font-display font-bold">📰 Latest News</h2>
          </div>
          <div className="py-1 max-h-[380px] overflow-y-auto">
            {loading.news ? (
              <div className="px-5"><Skeleton lines={5} /></div>
            ) : news.length > 0 ? (
              news.map((article, i) => (
                <NewsCard key={i} article={article} variant="compact" />
              ))
            ) : (
              <DataUnavailable
                icon="📰"
                message="News Unavailable"
                subtitle="Could not connect to news API. Check back later for real football headlines."
              />
            )}
          </div>
        </div>

        {/* Card: Mini Standings */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-400 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <div>
              <h2 className="font-display font-bold">🏆 Standings</h2>
              <DataSourceBadge source={dataSource.standings} season={seasonInfo} />
            </div>
            <LeagueDropdown value={standingsLeague} onChange={setStandingsLeague} />
          </div>
          <div className="py-1 max-h-[380px] overflow-y-auto">
            {loading.standings ? (
              <div className="px-5"><Skeleton lines={6} /></div>
            ) : standings.length > 0 ? (
              <StandingsTable standings={standings} compact />
            ) : (
              <DataUnavailable
                icon="🏆"
                message="Standings Unavailable"
                subtitle="Could not retrieve current season standings from football-data.org"
              />
            )}
          </div>
        </div>

        {/* Card: AI Insights (analysis/patterns, not match data) */}
        <div className="glass-card rounded-2xl overflow-hidden border-accent-purple/20 transition-all duration-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <h2 className="font-display font-bold">🧠 AI Insights</h2>
            <span className="text-[0.6rem] font-bold tracking-wider px-2.5 py-1 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
              AI
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="text-[0.6rem] text-text-muted/50 mb-2 italic">
              General football analysis patterns — not match-specific predictions
            </p>
            {insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} variant="compact" />
            ))}
            <button
              onClick={() => setInsights(getRandomInsights(2))}
              className="w-full text-center text-xs text-text-muted hover:text-accent-purple py-2 transition-colors cursor-pointer"
            >
              ↻ Refresh insights
            </button>
          </div>
        </div>

        {/* Card: Fun Fact + France Spotlight (stacked) */}
        <div className="flex flex-col gap-6">
          {/* Fun Fact */}
          <div className="glass-card rounded-2xl overflow-hidden border-accent-orange/20 transition-all duration-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <h2 className="font-display font-bold">🎯 Fun Fact</h2>
            </div>
            <div className="px-5 py-2">
              <FunFact fact={fact} onRefresh={() => setFact(getRandomFact())} />
            </div>
          </div>

          {/* France / Mbappé Spotlight */}
          <div className="glass-card rounded-2xl overflow-hidden border-france-blue/30 bg-[linear-gradient(145deg,rgba(0,35,149,0.12)_0%,rgba(20,27,45,0.9)_100%)] transition-all duration-400 hover:shadow-[0_0_30px_rgba(0,35,149,0.15)]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <h2 className="font-display font-bold">🇫🇷 France Spotlight</h2>
              <span className="text-[0.6rem] font-bold tracking-wider px-2.5 py-1 rounded-full bg-france-blue/30 text-blue-300 border border-france-blue/40">
                MBAPPÉ
              </span>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-extrabold text-lg mb-1">Kylian Mbappé</h3>
                  <p className="text-sm text-text-muted mb-3">Real Madrid · Forward · 🇫🇷 France</p>
                  <div className="flex gap-4 flex-wrap">
                    {mbappeScorer ? (
                      <>
                        <div className="flex flex-col items-center">
                          <span className="font-display font-extrabold text-2xl gradient-text-france">
                            {mbappeScorer.goals ?? mbappeScorer.numberOfGoals ?? '—'}
                          </span>
                          <span className="text-[0.6rem] text-text-muted uppercase tracking-wider">Goals</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-display font-extrabold text-2xl gradient-text-france">
                            {mbappeScorer.assists ?? '—'}
                          </span>
                          <span className="text-[0.6rem] text-text-muted uppercase tracking-wider">Assists</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-display font-extrabold text-2xl gradient-text-france">
                            {mbappeScorer.playedMatches ?? '—'}
                          </span>
                          <span className="text-[0.6rem] text-text-muted uppercase tracking-wider">Apps</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-text-secondary">
                        {dataSource.scorers === 'unavailable'
                          ? 'Stats unavailable — could not connect to data source.'
                          : 'Switch to La Liga to see Mbappé\'s stats, or check the Players page.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
