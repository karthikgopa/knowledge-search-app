import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSearchResults, fetchSuggestions } from "../api/mockApi";
import { useDebounce } from "./useDebounce";
import { useSearchHistory } from "./useSearchHistory";
import {
  Article,
  RequestState,
  SearchFilters,
  SortOption,
} from "../types/article";

const DEBOUNCE_MS = 300;
const DEFAULT_FILTERS: SearchFilters = {
  category: null,
  dateRange: { from: null, to: null },
};

export function useArticleSearch() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [resultState, setResultState] = useState<RequestState<{ articles: Article[]; total: number }>>({
    status: "idle",
  });

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const { history, addEntry, clearHistory } = useSearchHistory();

  // Guards against out-of-order responses when the user types quickly or
  // changes filters while a previous request is still in flight.
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const runSearch = useCallback(
    async (q: string, f: SearchFilters, sort: SortOption) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const thisRequestId = ++requestIdRef.current;

      setResultState({ status: "loading" });
      try {
        const result = await fetchSearchResults(q, f, sort, controller.signal);
        if (requestIdRef.current === thisRequestId) {
          setResultState({ status: "success", data: result });
        }
      } catch (err) {
        if (controller.signal.aborted) return; // superseded by a newer request
        if (requestIdRef.current === thisRequestId) {
          const message = err instanceof Error ? err.message : "Something went wrong.";
          setResultState({ status: "error", message });
        }
      }
    },
    []
  );

  // Re-run search whenever the debounced query, filters, or sort change.
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResultState({ status: "idle" });
      return;
    }
    runSearch(debouncedQuery, filters, sortBy);
  }, [debouncedQuery, filters, sortBy, runSearch]);

  // Fetch lightweight suggestions as the user types (separate from full search).
  useEffect(() => {
    let cancelled = false;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    fetchSuggestions(query).then((s) => {
      if (!cancelled) setSuggestions(s);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const submitSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setShowSuggestions(false);
      addEntry(q);
    },
    [addEntry]
  );

  const retry = useCallback(() => {
    if (debouncedQuery.trim()) runSearch(debouncedQuery, filters, sortBy);
  }, [debouncedQuery, filters, sortBy, runSearch]);

  return {
    query,
    setQuery,
    submitSearch,
    debouncedQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    resultState,
    retry,
    selectedArticle,
    setSelectedArticle,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    history,
    clearHistory,
  };
}
