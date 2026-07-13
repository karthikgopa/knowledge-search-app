import React from "react";
import { ArticleCard } from "./ArticleCard";
import { Article, RequestState } from "../types/article";

interface ResultsListProps {
  state: RequestState<{ articles: Article[]; total: number }>;
  query: string;
  onSelect: (article: Article) => void;
  onRetry: () => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ state, query, onSelect, onRetry }) => {
  if (state.status === "idle") {
    return (
      <div className="results-status" role="status">
        Start typing to search {" "}
        {/* Non-breaking hint keeps the empty state useful rather than blank */}
        the knowledge base.
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="results-status" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        Searching…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="results-status results-status--error" role="alert">
        <p>{state.message}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (state.data.articles.length === 0) {
    return (
      <div className="results-status" role="status">
        No articles matched “{query}”. Try a different term or clear filters.
      </div>
    );
  }

  return (
    <div>
      <p className="results-count">{state.data.total} result{state.data.total === 1 ? "" : "s"}</p>
      <div className="results-list">
        {state.data.articles.map((article) => (
          <ArticleCard key={article.id} article={article} query={query} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};
