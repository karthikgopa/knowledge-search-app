import { useCallback, useEffect, useState } from "react";
import { HistoryEntry } from "../types/article";

const STORAGE_KEY = "kb-search-history";
const MAX_ENTRIES = 5;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    // Corrupt or inaccessible storage should never break the app
    return [];
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore quota/availability errors, history simply won't persist
    }
  }, [history]);

  const addEntry = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const deduped = prev.filter((e) => e.query.toLowerCase() !== trimmed.toLowerCase());
      const next = [{ query: trimmed, timestamp: Date.now() }, ...deduped];
      return next.slice(0, MAX_ENTRIES);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, clearHistory };
}
