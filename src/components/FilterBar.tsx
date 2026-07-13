import React from "react";
import { CATEGORY_LIST } from "../data/mockArticles";
import { SearchFilters } from "../types/article";

interface FilterBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  return (
    <div className="filter-bar">
      <label className="filter-bar__field">
        <span>Category</span>
        <select
          value={filters.category ?? ""}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value || null })
          }
        >
          <option value="">All categories</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__field">
        <span>From</span>
        <input
          type="date"
          value={filters.dateRange.from ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              dateRange: { ...filters.dateRange, from: e.target.value || null },
            })
          }
        />
      </label>

      <label className="filter-bar__field">
        <span>To</span>
        <input
          type="date"
          value={filters.dateRange.to ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              dateRange: { ...filters.dateRange, to: e.target.value || null },
            })
          }
        />
      </label>

      {(filters.category || filters.dateRange.from || filters.dateRange.to) && (
        <button
          type="button"
          className="filter-bar__clear"
          onClick={() => onChange({ category: null, dateRange: { from: null, to: null } })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
};
