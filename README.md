# Knowledge article search interface

A simplified customer-service knowledge base search UI, built with React,
TypeScript, and hooks. No backend required — all data and API calls are
mocked in `src/data` and `src/api`.

## Run locally

```bash
npm install
npm run dev
```

## Structure

```
src/
  types/        Shared TypeScript types
  data/         Mock article dataset (30 seeded articles)
  api/          Mock API: search, suggestions, simulated latency/errors
  hooks/        useDebounce, useSearchHistory, useArticleSearch (state core)
  components/   SearchBar, FilterBar, SortControls, ResultsList,
                ArticleCard, ArticleDetail, SearchHistoryPanel
  App.tsx       Composition root
  App.css       Responsive styling
```
