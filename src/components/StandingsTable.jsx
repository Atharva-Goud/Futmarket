/**
 * StandingsTable Component
 * =========================
 * Renders a full league standings table with position indicators,
 * team crests, stats, and form dots.
 */
import { getTeamCrest } from '../utils/helpers';

/** Form dot (W/D/L) */
function FormDot({ result }) {
  const styles = {
    W: 'bg-accent-green text-bg-primary',
    D: 'bg-accent-yellow text-bg-primary',
    L: 'bg-accent-red text-white',
  };

  return (
    <span
      className={`w-4 h-4 rounded text-[0.55rem] font-bold flex items-center justify-center ${styles[result] || 'bg-bg-surface text-text-muted'}`}
    >
      {result}
    </span>
  );
}

/** Position class based on rank */
function getPosClass(pos, totalTeams) {
  if (pos === 1) return 'text-accent-green';   // Champions
  if (pos <= 4) return 'text-accent-blue';      // UCL spots
  if (pos <= 6) return 'text-accent-orange';    // UEL / UECL
  if (pos > totalTeams - 3) return 'text-accent-red'; // Relegation
  return 'text-text-muted';
}

export default function StandingsTable({ standings = [], compact = false }) {
  if (!standings.length) return null;

  const totalTeams = standings.length;

  // Compact mode shows top 8 only
  const rows = compact ? standings.slice(0, 8) : standings;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-bg-card text-text-muted text-xs uppercase tracking-wider">
            <th className="text-left py-2 px-3 rounded-tl-xl">#</th>
            <th className="text-left py-2 px-3">Team</th>
            <th className="text-center py-2 px-1">P</th>
            <th className="text-center py-2 px-1">W</th>
            <th className="text-center py-2 px-1">D</th>
            <th className="text-center py-2 px-1">L</th>
            {!compact && <th className="text-center py-2 px-1">GF</th>}
            {!compact && <th className="text-center py-2 px-1">GA</th>}
            <th className="text-center py-2 px-1">GD</th>
            <th className="text-center py-2 px-3 font-bold">Pts</th>
            {!compact && <th className="text-center py-2 px-3 rounded-tr-xl">Form</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = row.team;
            const posClass = getPosClass(row.position, totalTeams);

            // Parse form string (e.g., "W,W,L,D,W")
            const formArr = row.form ? row.form.split(',') : [];

            return (
              <tr
                key={team.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className={`py-2.5 px-3 font-display font-bold ${posClass}`}>
                  {row.position}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2 font-semibold text-text-primary">
                    {getTeamCrest(team) ? (
                      <img src={getTeamCrest(team)} alt="" className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="w-5 text-center">⚽</span>
                    )}
                    <span className="truncate max-w-[140px]">{team.shortName || team.name}</span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-1 text-text-secondary">{row.playedGames}</td>
                <td className="text-center py-2.5 px-1 text-text-secondary">{row.won}</td>
                <td className="text-center py-2.5 px-1 text-text-secondary">{row.draw}</td>
                <td className="text-center py-2.5 px-1 text-text-secondary">{row.lost}</td>
                {!compact && <td className="text-center py-2.5 px-1 text-text-secondary">{row.goalsFor}</td>}
                {!compact && <td className="text-center py-2.5 px-1 text-text-secondary">{row.goalsAgainst}</td>}
                <td className="text-center py-2.5 px-1 text-text-secondary">
                  {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                </td>
                <td className="text-center py-2.5 px-3 font-display font-extrabold text-text-primary">
                  {row.points}
                </td>
                {!compact && (
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1 justify-center">
                      {formArr.slice(-5).map((f, i) => (
                        <FormDot key={i} result={f} />
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {compact && standings.length > 8 && (
        <div className="text-center py-3 text-xs text-text-muted">
          Showing top 8 of {standings.length} teams
        </div>
      )}
    </div>
  );
}
