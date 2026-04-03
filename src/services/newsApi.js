/**
 * News API Service
 * =================
 * Fetches REAL football news from NewsAPI.org (free tier).
 *
 * DATA ACCURACY RULES:
 *  - No fabricated news headlines or descriptions
 *  - If the API is unavailable, returns empty array
 *  - Only real, externally sourced articles are displayed
 */

const NEWS_API_KEY = '5e06dfc0ac5b4539adca13a03e36d42a'; // Free NewsAPI key
const NEWS_BASE = 'https://newsapi.org/v2';

// Cache
let newsCache = null;
let newsCacheTime = 0;
const NEWS_CACHE_TTL = 10 * 60 * 1000; // 10 min

/**
 * Fetch football news articles.
 * Returns ONLY real articles from external sources.
 * Returns empty array if API is unavailable (no fake headlines).
 *
 * @param {number} limit - Number of articles to return
 */
export async function getFootballNews(limit = 9) {
  // Check cache
  if (newsCache && Date.now() - newsCacheTime < NEWS_CACHE_TTL) {
    return newsCache.slice(0, limit);
  }

  try {
    const res = await fetch(
      `${NEWS_BASE}/everything?q=football+OR+soccer+OR+premier+league+OR+champions+league&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
    );

    if (!res.ok) throw new Error(`News API error: ${res.status}`);

    const data = await res.json();
    if (data.articles && data.articles.length > 0) {
      // Filter out removed/empty articles
      const articles = data.articles.filter(
        (a) => a.title !== '[Removed]' && a.description && a.title
      );
      newsCache = articles;
      newsCacheTime = Date.now();
      return articles.slice(0, limit);
    }
  } catch (err) {
    console.warn('News API unavailable:', err.message);
  }

  // No fallback – return empty array. No fake headlines allowed.
  return [];
}
