/**
 * NewsCard Component
 * ===================
 * Displays a news article with image, title, description, and metadata.
 * Variants: 'compact' (sidebar) and 'full' (news page grid)
 */
import { timeAgo } from '../utils/helpers';

export default function NewsCard({ article, variant = 'compact' }) {
  if (!article) return null;

  const handleClick = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Compact variant – used in dashboard sidebar
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className="flex gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300 cursor-pointer group hover:translate-x-1"
      >
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt=""
            className="w-20 h-[60px] rounded-lg object-cover flex-shrink-0 bg-bg-surface"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-text-primary line-clamp-2 group-hover:text-accent-green transition-colors">
            {article.title}
          </h4>
          <div className="flex gap-2 mt-1 text-xs text-text-muted">
            <span>{article.source?.name}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant – card for news grid page
  return (
    <div
      onClick={handleClick}
      className="glass-card rounded-2xl overflow-hidden transition-all duration-400 cursor-pointer group hover:-translate-y-1 hover:shadow-lg hover:border-white/15"
    >
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt=""
          className="w-full h-48 object-cover bg-bg-surface group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop';
          }}
        />
      )}
      <div className="p-5">
        <h3 className="font-display font-bold text-base mb-2 line-clamp-2 group-hover:text-accent-green transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-sm text-text-secondary line-clamp-3 mb-3">
            {article.description}
          </p>
        )}
        <div className="flex justify-between text-xs text-text-muted">
          <span>{article.source?.name}</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
