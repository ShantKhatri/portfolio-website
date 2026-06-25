"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NowItem } from "@/types/content";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface NowFeedProps {
  items: NowItem[];
}

const BADGE_CLASSES: Record<NowItem["type"], string> = {
  talk: "badge-talk",
  event: "badge-event",
  milestone: "badge-milestone",
  release: "badge-release",
  news: "badge-news",
};

function NowBadge({ type }: { type: NowItem["type"] }) {
  return (
    <span
      className={cn(
        "pill-base flex-shrink-0",
        BADGE_CLASSES[type]
      )}
    >
      {type}
    </span>
  );
}

function NowRow({ item }: { item: NowItem }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-3 sm:min-w-[140px] flex-shrink-0 sm:pt-1">
        <span className="text-[16px] font-mono text-[var(--fg-subtle)]">
          {item.date}
        </span>
        <NowBadge type={item.type} />
      </div>
      <span className="text-[16px] text-[var(--fg)] leading-[1.6] flex-1">
        {item.text}
      </span>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors duration-150"
          aria-label="External link"
        >
          <ExternalLink size={11} strokeWidth={1.5} />
        </a>
      )}
    </div>
  );
}

export function NowFeed({ items }: NowFeedProps) {
  const [showArchive, setShowArchive] = useState(false);

  const visible = items.filter((i) => !i.archived);
  const archived = items.filter((i) => i.archived);

  if (items.length === 0) return null;

  return (
    <div>
      <div>
        {visible.map((item, i) => (
          <NowRow key={i} item={item} />
        ))}
      </div>

      {archived.length > 0 && (
        <>
          <button
            onClick={() => setShowArchive((v) => !v)}
            className="mt-3 text-[15px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150 cursor-pointer"
          >
            {showArchive ? "collapse ↑" : "archive →"}
          </button>

          <AnimatePresence>
            {showArchive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-1 opacity-70">
                  {archived.map((item, i) => (
                    <NowRow key={i} item={item} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
