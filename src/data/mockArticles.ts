import { Article } from "../types/article";

const CATEGORIES = [
  "Account & Billing",
  "Technical Support",
  "Product Setup",
  "Security",
  "Integrations",
];

const TAG_POOL = [
  "password-reset",
  "api",
  "onboarding",
  "sso",
  "troubleshooting",
  "billing-cycle",
  "webhooks",
  "mobile-app",
  "two-factor",
  "data-export",
  "permissions",
  "outage",
];

const TITLES = [
  "How to reset a customer's password",
  "Understanding proration on plan upgrades",
  "Configuring single sign-on with Okta",
  "Troubleshooting failed webhook deliveries",
  "Setting up two-factor authentication",
  "Exporting account data as CSV",
  "Diagnosing slow API response times",
  "Managing role-based permissions for teams",
  "Resolving duplicate ticket creation",
  "Integrating with Salesforce",
  "Handling failed payment retries",
  "Migrating from the legacy dashboard",
  "Setting up email notification rules",
  "Debugging OAuth token expiration",
  "Best practices for bulk data import",
  "Configuring mobile push notifications",
  "Understanding rate limits on the public API",
  "Recovering a suspended account",
  "Customizing the customer-facing help center",
  "Setting up audit logging for compliance",
  "Resolving SSL certificate errors",
  "Managing multi-region data residency",
  "Configuring Slack integration alerts",
  "Understanding usage-based billing",
  "Troubleshooting login loop issues",
  "Setting up automated ticket routing",
  "Explaining article relevance scoring",
  "Configuring session timeout policies",
  "Resolving sync conflicts with Zendesk",
  "Guide to the knowledge base editor",
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function buildArticles(): Article[] {
  const rand = seededRandom(42);
  return TITLES.map((title, i) => {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const tagCount = 2 + Math.floor(rand() * 3);
    const tags = Array.from(
      new Set(
        Array.from({ length: tagCount }, () => TAG_POOL[Math.floor(rand() * TAG_POOL.length)])
      )
    );
    const createdDaysAgo = Math.floor(rand() * 400) + 5;
    const updatedDaysAgo = Math.max(0, createdDaysAgo - Math.floor(rand() * 60));

    return {
      id: `article-${i + 1}`,
      title,
      content:
        `${title}. This article walks through the relevant steps, common pitfalls, and how ` +
        `to verify the fix worked. It covers the most frequent variations agents encounter, ` +
        `including edge cases raised in past support tickets, and links to related settings ` +
        `pages where applicable.`,
      category,
      tags,
      relevanceScore: Math.round((0.4 + rand() * 0.6) * 100) / 100,
      createdDate: daysAgoIso(createdDaysAgo),
      lastUpdated: daysAgoIso(updatedDaysAgo),
      viewCount: Math.floor(rand() * 5000),
    };
  });
}

export const MOCK_ARTICLES: Article[] = buildArticles();
export const CATEGORY_LIST = CATEGORIES;
