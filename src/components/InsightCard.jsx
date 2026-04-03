/**
 * InsightCard Component
 * ======================
 * Displays an AI-powered insight with icon, label, title, and text.
 */
export default function InsightCard({ insight, variant = 'compact' }) {
  if (!insight) return null;

  if (variant === 'compact') {
    return (
      <div className="py-3 px-4 bg-accent-purple/5 border-l-3 border-l-accent-purple rounded-r-lg mb-3 last:mb-0">
        <div className="text-[0.65rem] font-bold text-accent-purple uppercase tracking-widest mb-1">
          {insight.label}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
      </div>
    );
  }

  // Full card variant
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-400 hover:border-accent-purple/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]">
      <div className="text-3xl mb-4">{insight.icon}</div>
      <div className="text-[0.65rem] font-bold text-accent-purple uppercase tracking-widest mb-2">
        {insight.label}
      </div>
      <h3 className="font-display font-bold text-lg mb-2 gradient-text-ai">
        {insight.title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
    </div>
  );
}
