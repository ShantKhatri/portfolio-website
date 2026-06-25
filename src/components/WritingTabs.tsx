"use client";

import { useState } from "react";
import type { HashnodePost } from "@/types/hashnode";
import type { Talk } from "@/types/content";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WritingTabsProps {
  posts: HashnodePost[];
  talks: Talk[];
}

export function WritingTabs({ posts, talks }: WritingTabsProps) {
  const [activeTab, setActiveTab] = useState<"writing" | "talks">("writing");

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] mb-6">
        {(["writing", "talks"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "text-[18px] font-mono pb-2 mr-6 border-b-[1.5px] transition-all duration-150 cursor-pointer",
              activeTab === tab
                ? "text-[var(--fg)] border-[var(--fg)]"
                : "text-[var(--fg-muted)] border-transparent hover:text-[var(--fg)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Writing */}
      {activeTab === "writing" && (
        <div>
          {posts.length === 0 ? (
            <p className="text-[15px] text-[var(--fg-subtle)] py-4">
              no posts yet - check back soon.
            </p>
          ) : (
            <div>
              {posts.map((post, i) => (
                <a
                  key={post.slug}
                  href={`https://rootcause.hashnode.dev/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-3.5 border-b border-[var(--border)] first:pt-0 last:border-0 last:pb-0 hover-row rounded-sm group cursor-pointer transition-colors duration-150 px-1 -mx-1"
                >
                  <span className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[24px] flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-[var(--fg)] mb-0.5 group-hover:text-[var(--fg)]">
                      {post.title}
                    </div>
                    <div className="text-[18px] font-mono text-[var(--fg-subtle)]">
                      rootcause.hashnode.dev · {formatDate(post.publishedAt)} · {post.readTimeInMinutes} min read
                    </div>
                  </div>
                  <span className="pill-base flex-shrink-0 border-[var(--border-mid)] text-[var(--fg-muted)] bg-[var(--bg-surface)]">
                    article
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Talks */}
      {activeTab === "talks" && (
        <div>
          {talks.length === 0 ? (
            <p className="text-[15px] text-[var(--fg-subtle)] py-4">
              no talks yet - check back soon.
            </p>
          ) : (
            <div>
              {talks.map((talk, i) => (
                <div
                  key={talk.id}
                  className="py-3.5 border-b border-[var(--border)] first:pt-0 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[24px] flex-shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="text-[15px] font-medium text-[var(--fg)]">
                          {talk.title}
                        </div>
                        <span
                          className={cn(
                            "pill-base flex-shrink-0",
                            talk.type === "upcoming"
                              ? "pill-in-progress"
                              : "border-[var(--border-mid)] text-[var(--fg-muted)] bg-[var(--bg-surface)]"
                          )}
                        >
                          {talk.type}
                        </span>
                      </div>
                      <div className="text-[18px] font-mono text-[var(--fg-subtle)] mb-1">
                        {talk.event} · {talk.date}
                      </div>
                      {talk.description && (
                        <div className="text-[18px] text-[var(--fg-muted)] leading-[1.6] mb-2">
                          {talk.description}
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        {talk.slides && (
                          <a
                            href={talk.slides}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[15px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                          >
                            slides <ExternalLink size={10} strokeWidth={1.5} />
                          </a>
                        )}
                        {talk.video && (
                          <a
                            href={talk.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[15px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                          >
                            video <ExternalLink size={10} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
