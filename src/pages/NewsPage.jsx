/**
 * News Page
 * ==========
 * Full news page with real articles from external sources only.
 *
 * DATA ACCURACY RULES:
 *  - Only real, externally sourced articles displayed
 *  - No fabricated or placeholder news headlines
 *  - "News Unavailable" when API is unreachable
 */
import { useState, useEffect } from 'react';
import { getFootballNews } from '../services/newsApi';
import NewsCard from '../components/NewsCard';
import Skeleton from '../components/Skeleton';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const articles = await getFootballNews(12);
        setNews(articles);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold">📰 Football News</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="skeleton w-full h-48 mb-4" />
              <Skeleton lines={3} />
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {news.map((article, i) => (
            <NewsCard key={i} article={article} variant="full" />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl py-16 text-center">
          <div className="text-5xl mb-4 opacity-40">📰</div>
          <p className="text-accent-orange text-lg font-semibold">News Unavailable</p>
          <p className="text-text-muted text-sm mt-2">
            Could not connect to external news sources
          </p>
          <p className="text-text-muted text-xs mt-3 max-w-md mx-auto leading-relaxed">
            FutMarket does not generate or fabricate news headlines.
            All articles must come from verified external sources.
            Please try again later or check your API configuration.
          </p>
        </div>
      )}
    </div>
  );
}
