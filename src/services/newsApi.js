/**
 * News API Service
 * =================
 * Fetches REAL football news from The Guardian Open Platform (free tier).
 * Using The Guardian avoids browser CORS issues and doesn't require proxying.
 *
 * DATA ACCURACY RULES:
 *  - No fabricated news headlines or descriptions
 *  - If the API is unavailable, returns empty array
 *  - Only real, externally sourced articles are displayed
 */

const GUARDIAN_API_KEY = 'test'; // Free developer key
const GUARDIAN_BASE = 'https://content.guardianapis.com';

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
      `${GUARDIAN_BASE}/search?q=football&section=football&show-fields=thumbnail,trailText,headline&page-size=${limit}&api-key=${GUARDIAN_API_KEY}`
    );

    if (!res.ok) throw new Error(`Guardian API error: ${res.status}`);

    const data = await res.json();
    const results = data.response?.results;
    
    if (results && results.length > 0) {
      // Map The Guardian's structure to our application's expected format (NewsAPI style)
      const articles = results.map(article => ({
        title: article.fields?.headline || article.webTitle,
        description: article.fields?.trailText?.replace(/<[^>]*>?/gm, '') || '', // Strip HTML tags
        urlToImage: article.fields?.thumbnail || null,
        url: article.webUrl,
        publishedAt: article.webPublicationDate,
        source: { name: 'The Guardian' }
      }));

      // Filter out articles that lack titles
      const validArticles = articles.filter(a => a.title);

      if (validArticles.length > 0) {
        newsCache = validArticles;
        newsCacheTime = Date.now();
        return validArticles.slice(0, limit);
      }
    }
  } catch (err) {
    console.warn('News API unavailable:', err.message);
  }

  // No fallback – return empty array. No fake headlines allowed.
  return [];
}
