/**
 * Header / Navbar Component
 * ==========================
 * Sticky header with logo, navigation, live indicator, and search.
 */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/scores', label: 'Scores', icon: '⚽' },
  { path: '/news', label: 'News', icon: '📰' },
  { path: '/standings', label: 'Standings', icon: '🏆' },
  { path: '/players', label: 'Players', icon: '👟' },
  { path: '/insights', label: 'Insights', icon: '🧠' },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/players?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group hover:scale-[1.02] transition-transform">
          {/* SVG Logo */}
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
            <circle cx="20" cy="20" r="18" stroke="url(#hLogo)" strokeWidth="2.5" fill="none" />
            <polygon
              points="20,10 23,17 30,18 25,23 26,30 20,27 14,30 15,23 10,18 17,17"
              fill="url(#hLogo)"
            />
            <defs>
              <linearGradient id="hLogo" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#00f5a0" />
                <stop offset="100%" stopColor="#00d9f5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl gradient-text leading-tight">
              FutMarket
            </span>
            <span className="text-[0.6rem] text-text-muted uppercase tracking-[3px] font-medium">
              Intelligence Hub
            </span>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex gap-1 order-3 sm:order-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right side: Live indicator + Search */}
        <div className="flex items-center gap-3 order-2 sm:order-3">
          {/* Live pulse */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-red/15 border border-accent-red/30 rounded-full animate-[pulse-glow_2s_ease-in-out_infinite]">
            <span className="w-2 h-2 bg-accent-red rounded-full animate-[dot-pulse_1.5s_ease-in-out_infinite]" />
            <span className="text-[0.65rem] font-bold text-accent-red tracking-wider hidden sm:inline">
              LIVE
            </span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, players..."
              className="bg-bg-input border border-white/10 rounded-full text-text-primary text-sm px-4 py-2 pl-9 w-52 focus:w-72 outline-none transition-all duration-300 focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(0,245,160,0.1)]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
              🔍
            </span>
          </form>
        </div>
      </div>
    </header>
  );
}
