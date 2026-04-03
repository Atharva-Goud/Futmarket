/**
 * MatchCard Component
 * ====================
 * Displays a single match with teams, score, and status.
 * Variants: 'compact' (dashboard) and 'full' (scores page)
 *
 * DATA ACCURACY RULES:
 *  - Matches without valid date/time are NOT rendered (returns null)
 *  - Scores are only shown if the match has actual real data
 *  - "Data Unavailable" is shown when real score cannot be verified
 *  - No scores are generated or assumed
 */
import { getMatchStatusDisplay, isLive, formatTime, getTeamCrest } from '../utils/helpers';

export default function MatchCard({ match, variant = 'compact' }) {
  // VALIDATION: Do not render if date/time is missing or invalid
  if (!match?.utcDate) return null;
  const matchDate = new Date(match.utcDate);
  if (isNaN(matchDate.getTime())) return null;

  const home = match.homeTeam;
  const away = match.awayTeam;
  const score = match.score;
  const status = getMatchStatusDisplay(match.status);
  const live = isLive(match.status);

  // Score display: only real data, never assumed
  const isFinished = match.status === 'FINISHED';
  const isInPlay = live;
  const hasScore =
    score?.fullTime?.home !== null &&
    score?.fullTime?.home !== undefined &&
    score?.fullTime?.away !== null &&
    score?.fullTime?.away !== undefined;

  // Only show scores for finished or in-play matches that have real data
  const showScore = (isFinished || isInPlay) && hasScore;
  const homeGoals = showScore ? score.fullTime.home : null;
  const awayGoals = showScore ? score.fullTime.away : null;

  const homeWins = showScore && homeGoals > awayGoals;
  const awayWins = showScore && awayGoals > homeGoals;

  const isCompact = variant === 'compact';

  return (
    <div
      className={`
        group flex items-center justify-between rounded-xl transition-all duration-300
        ${isCompact
          ? 'px-3 py-2.5 hover:bg-white/[0.02] border-b border-white/5 last:border-b-0'
          : 'glass-card px-5 py-4 mb-2 hover:translate-x-1 hover:shadow-lg hover:border-white/15'
        }
        ${live ? 'border-l-2 border-l-accent-red' : ''}
      `}
    >
      {/* Teams */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Home team */}
        <div className={`flex items-center gap-2 text-sm ${homeWins ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
          {getTeamCrest(home) ? (
            <img src={getTeamCrest(home)} alt="" className="w-5 h-5 object-contain" />
          ) : (
            <span className="w-5 text-center text-xs">🏠</span>
          )}
          <span className="truncate">{home?.shortName || home?.name || 'TBD'}</span>
        </div>
        {/* Away team */}
        <div className={`flex items-center gap-2 text-sm ${awayWins ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
          {getTeamCrest(away) ? (
            <img src={getTeamCrest(away)} alt="" className="w-5 h-5 object-contain" />
          ) : (
            <span className="w-5 text-center text-xs">🏟️</span>
          )}
          <span className="truncate">{away?.shortName || away?.name || 'TBD'}</span>
        </div>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center gap-0.5 min-w-[36px] mx-3">
        {showScore ? (
          <>
            <span className={`font-display font-bold text-base ${homeWins ? 'text-accent-green' : 'text-text-secondary'}`}>
              {homeGoals}
            </span>
            <span className={`font-display font-bold text-base ${awayWins ? 'text-accent-green' : 'text-text-secondary'}`}>
              {awayGoals}
            </span>
          </>
        ) : match.status === 'SCHEDULED' || match.status === 'TIMED' ? (
          <>
            <span className="font-display font-bold text-base text-text-muted">-</span>
            <span className="font-display font-bold text-base text-text-muted">-</span>
          </>
        ) : (
          /* Match happened but score data is unavailable */
          <span className="text-[0.6rem] text-accent-orange font-medium text-center leading-tight whitespace-nowrap">
            Data<br />Unavail.
          </span>
        )}
      </div>

      {/* Status / Time */}
      <div className="flex flex-col items-end gap-0.5 min-w-[70px]">
        <span className={`text-xs font-semibold uppercase tracking-wider ${status.className}`}>
          {live && <span className="inline-block w-1.5 h-1.5 bg-accent-red rounded-full mr-1.5 animate-pulse" />}
          {match.status === 'SCHEDULED' || match.status === 'TIMED'
            ? formatTime(match.utcDate)
            : status.label}
        </span>
        {match.competition && (
          <span className="text-[0.65rem] text-text-muted truncate max-w-[100px]">
            {match.competition.name}
          </span>
        )}
      </div>
    </div>
  );
}
