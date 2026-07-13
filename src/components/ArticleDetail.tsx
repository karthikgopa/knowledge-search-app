import React, { useEffect } from "react";
import { Article } from "../types/article";

interface ArticleDetailProps {
  article: Article | null;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!article) return null;

  return (
    <div className="article-detail__overlay" onClick={onClose}>
      <aside
        className="article-detail__panel"
        role="dialog"
        aria-modal="true"
        aria-label={article.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="article-detail__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <span className="article-card__category">{article.category}</span>
        <h2 className="article-detail__title">{article.title}</h2>
        <div className="article-detail__meta">
          <span>Updated {formatDate(article.lastUpdated)}</span>
          <span>·</span>
          <span>{article.viewCount.toLocaleString()} views</span>
          <span>·</span>
          <span>{Math.round(article.relevanceScore * 100)}% relevance</span>
        </div>
        <p className="article-detail__content">{article.content}</p>
        <div className="article-card__meta">
          {article.tags.map((tag) => (
            <span key={tag} className="article-card__tag">
              {tag}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
};
