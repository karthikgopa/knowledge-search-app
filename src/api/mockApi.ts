import { Article, SearchFilters, SearchResult, SortOption } from "../types/article";
import { MOCK_ARTICLES } from "../data/mockArticles";

const NETWORK_DELAY_MS = { min: 250, max: 700 };
const SIMULATED_ERROR_RATE = 0.06; // ~1 in 17 requests fails, to exercise error handling

function randomDelay(): Promise<void> {
  const ms =
    NETWORK_DELAY_MS.min + Math.random() * (NETWORK_DELAY_MS.max - NETWORK_DELAY_MS.min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function textMatches(article: Article, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    article.title.toLowerCase().includes(q) ||
    article.content.toLowerCase().includes(q) ||
    article.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function withinDateRange(article: Article, filters: SearchFilters): boolean {
  const { from, to } = filters.dateRange;
  const created = new Date(article.createdDate).getTime();
  if (from && created < new Date(from).getTime()) return false;
  if (to && created > new Date(to).getTime()) return false;
  return true;
}

function applySort(articles: Article[], sortBy: SortOption): Article[] {
  const copy = [...articles];
  switch (sortBy) {
    case "date":
      return copy.sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    case "popularity":
      return copy.sort((a, b) => b.viewCount - a.viewCount);
    case "relevance":
    default:
      return copy.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

/**
 * Simulates a search API call. Rejects a small percentage of the time so
 * error-handling UI paths are exercised without a real backend.
 */
export async function fetchSearchResults(
  query: string,
  filters: SearchFilters,
  sortBy: SortOption,
  signal?: AbortSignal
): Promise<SearchResult> {
  await randomDelay();

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }
  if (Math.random() < SIMULATED_ERROR_RATE) {
    throw new Error("The search service is temporarily unavailable. Please try again.");
  }

  let results = MOCK_ARTICLES.filter((a) => textMatches(a, query));
  if (filters.category) {
    results = results.filter((a) => a.category === filters.category);
  }
  results = results.filter((a) => withinDateRange(a, filters));
  results = applySort(results, sortBy);

  return { articles: results, total: results.length };
}

/**
 * Lightweight suggestion lookup for the search-as-you-type dropdown.
 * Intentionally cheaper/faster than the full search call.
 */
export async function fetchSuggestions(query: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_ARTICLES.filter((a) => a.title.toLowerCase().includes(q))
    .slice(0, 6)
    .map((a) => a.title);
}
