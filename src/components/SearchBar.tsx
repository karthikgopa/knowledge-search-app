import React, { useEffect, useRef } from "react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onSubmit,
  suggestions,
  showSuggestions,
  setShowSuggestions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setShowSuggestions]);

  return (
    <div className="search-bar" ref={containerRef}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search knowledge articles..."
        value={query}
        aria-label="Search knowledge articles"
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit(query);
          if (e.key === "Escape") setShowSuggestions(false);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-bar__suggestions" role="listbox">
          {suggestions.map((s) => (
            <li
              key={s}
              role="option"
              aria-selected="false"
              className="search-bar__suggestion"
              onClick={() => onSubmit(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
