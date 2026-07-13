import React from "react";
import { HistoryEntry } from "../types/article";

interface SearchHistoryProps {
  history: HistoryEntry[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export const SearchHistoryPanel: React.FC<SearchHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="search-history">
      <div className="search-history__header">
        <span>Recent searches</span>
        <button type="button" onClick={onClear}>
          Clear
        </button>
      </div>
      <ul>
        {history.map((entry) => (
          <li key={entry.timestamp}>
            <button type="button" onClick={() => onSelect(entry.query)}>
              {entry.query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
