/**
 * Utility helpers for FutMarket
 */

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 */
export function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format time from a date string
 * @param {string} dateStr - ISO date string
 */
export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} dateStr - ISO date string
 */
export function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

/**
 * Get today's date in YYYY-MM-DD format
 * @param {number} offsetDays - Days to offset (negative = past)
 */
export function getDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

/**
 * Match status display helper
 * @param {string} status - API status string
 * @returns {{ label: string, className: string }}
 */
export function getMatchStatusDisplay(status) {
  const map = {
    SCHEDULED: { label: 'Upcoming', className: 'text-accent-cyan' },
    TIMED: { label: 'Upcoming', className: 'text-accent-cyan' },
    IN_PLAY: { label: 'LIVE', className: 'text-accent-red animate-pulse' },
    PAUSED: { label: 'HT', className: 'text-accent-yellow' },
    FINISHED: { label: 'FT', className: 'text-text-muted' },
    POSTPONED: { label: 'PPD', className: 'text-accent-orange' },
    CANCELLED: { label: 'CAN', className: 'text-accent-red' },
    SUSPENDED: { label: 'SUS', className: 'text-accent-orange' },
    AWARDED: { label: 'AWD', className: 'text-accent-green' },
  };
  return map[status] || { label: status, className: 'text-text-muted' };
}

/**
 * Check if a match is live
 * @param {string} status
 */
export function isLive(status) {
  return status === 'IN_PLAY' || status === 'PAUSED';
}

/**
 * Truncate string to max length
 * @param {string} str
 * @param {number} max
 */
export function truncate(str, max = 100) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

/**
 * Get team crest URL with fallback
 * @param {object} team - Team object from API
 */
export function getTeamCrest(team) {
  return team?.crest || team?.emblem || '';
}
