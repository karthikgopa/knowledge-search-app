import React from "react";
import { Article } from "../types/article";

interface ArticleCardProps {
  article: Article;
  query: string;
  onSelect: (article: Article) => void;
}

function buildSnippet(content: string, query: string, maxLength = 160): string {
  const q = query.trim().toLowerCase();
  const lower = content.toLowerCase();
  const idx = q ? lower.indexOf(q) : -1;

  if (idx === -1) {
    return content.length > maxLength ? content.slice(0, maxLength) + "…" : content;
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + q.length + 80);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + content.slice(start, end) + suffix;
}

function ArticleCardImpl({ article, query, onSelect }: ArticleCardProps) {
  return (
    <article
      className="article-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(article)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(article);
      }}
    >
      <div className="article-card__header">
        <h3 className="article-card__title">{article.title}</h3>
        <span className="article-card__score" title="Relevance score">
          {Math.round(article.relevanceScore * 100)}%
        </span>
      </div>
      <p className="article-card__snippet">{buildSnippet(article.content, query)}</p>
      <div className="article-card__meta">
        <span className="article-card__category">{article.category}</span>
        {article.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="article-card__tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// Custom equality check: only re-render a card if its own data, the active
// query (affects snippet highlighting), or the selection handler changes.
export const ArticleCard = React.memo(ArticleCardImpl, (prev, next) => {
  return (
    prev.article === next.article &&
    prev.query === next.query &&
    prev.onSelect === next.onSelect
  );
});
