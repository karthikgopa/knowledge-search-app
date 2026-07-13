import React from "react";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";
import { SortControls } from "./components/SortControls";
import { ResultsList } from "./components/ResultsList";
import { ArticleDetail } from "./components/ArticleDetail";
import { SearchHistoryPanel } from "./components/SearchHistoryPanel";
import { useArticleSearch } from "./hooks/useArticleSearch";
import "./App.css";

export default function App() {
  const {
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
  } = useArticleSearch();

  return (
    <div className="app">
      <header className="app__header">
        <h1>Knowledge base search</h1>
        <SearchBar
          query={query}
          onChange={setQuery}
          onSubmit={submitSearch}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
      </header>

      <div className="app__toolbar">
        <FilterBar filters={filters} onChange={setFilters} />
        <SortControls sortBy={sortBy} onChange={setSortBy} />
      </div>

      <div className="app__body">
        <main className="app__results">
          <ResultsList
            state={resultState}
            query={debouncedQuery}
            onSelect={setSelectedArticle}
            onRetry={retry}
          />
        </main>

        <aside className="app__sidebar">
          <SearchHistoryPanel history={history} onSelect={submitSearch} onClear={clearHistory} />
        </aside>
      </div>

      <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
