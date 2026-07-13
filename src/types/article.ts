export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  createdDate: string; // ISO date
  lastUpdated: string; // ISO date
  viewCount: number;
}

export type SortOption = "relevance" | "date" | "popularity";

export interface DateRange {
  from: string | null; // ISO date
  to: string | null; // ISO date
}

export interface SearchFilters {
  category: string | null; // null = all categories
  dateRange: DateRange;
}

export interface SearchParams {
  query: string;
  filters: SearchFilters;
  sortBy: SortOption;
}

export interface SearchResult {
  articles: Article[];
  total: number;
}

export interface HistoryEntry {
  query: string;
  timestamp: number;
}

// Discriminated union so components can render exhaustively on request state
export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
