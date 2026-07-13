import React from "react";
import { SortOption } from "../types/article";

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (sort: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Most recently updated" },
  { value: "popularity", label: "Popularity" },
];

export const SortControls: React.FC<SortControlsProps> = ({ sortBy, onChange }) => (
  <label className="sort-controls">
    <span>Sort by</span>
    <select value={sortBy} onChange={(e) => onChange(e.target.value as SortOption)}>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);
