/**
 * LeagueSelector Component
 * =========================
 * Dropdown or chip selector for filtering by league.
 */
import { LEAGUES } from '../services/footballApi';

const leagueEntries = Object.values(LEAGUES);

/**
 * Dropdown variant
 */
export function LeagueDropdown({ value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        bg-bg-input border border-white/10 text-text-secondary
        font-body text-sm px-3 py-1.5 rounded-lg outline-none
        cursor-pointer transition-colors
        focus:border-accent-green
        ${className}
      `}
    >
      {leagueEntries.map((league) => (
        <option key={league.code} value={league.code} className="bg-bg-card text-text-primary">
          {league.country} {league.name}
        </option>
      ))}
    </select>
  );
}

/**
 * Chip / filter bar variant (for Scores page)
 */
export function LeagueChips({ value, onChange, includeAll = true }) {
  const options = includeAll
    ? [{ code: 'all', name: 'All Leagues', country: '🌍' }, ...leagueEntries]
    : leagueEntries;

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((league) => (
        <button
          key={league.code}
          onClick={() => onChange(league.code)}
          className={`
            text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer
            ${value === league.code
              ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary border-transparent font-semibold'
              : 'bg-bg-card border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20'
            }
          `}
        >
          {league.country} {league.name}
        </button>
      ))}
    </div>
  );
}
