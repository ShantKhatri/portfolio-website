import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { CONFERENCES, OSS_ORGS } from "@/lib/data";
import talksData from "../../../content/talks.json";
import type { Talk } from "@/types/content";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Community",
  description: "Conferences, volunteering, OSS organizations, and speaking engagements.",
};

export default function CommunityPage() {
  const talks = talksData as Talk[];

  return (
    <>
      {/* Page header */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
            community
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <h1
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          Open Source &amp;
          <br />
          <span className="text-[var(--fg-subtle)]">Community.</span>
        </h1>
      </section>

      {/* Conferences & events */}
      <section className="py-10 border-b border-[var(--border)]">
        <SectionHeader label="conferences & events" />
        <div>
          {CONFERENCES.map((event, i) => (
            <div
              key={i}
              className="flex items-baseline gap-4 py-3 border-b border-[var(--border)] first:pt-0 last:border-0 last:pb-0"
            >
              <span className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[36px] flex-shrink-0">
                {event.year}
              </span>
              <div className="flex-1">
                <span className="text-[15px] font-medium text-[var(--fg)]">{event.name}</span>
                <span className="text-[18px] text-[var(--fg-muted)] mx-2">·</span>
                <span className="text-[18px] text-[var(--fg-muted)]">{event.role}</span>
              </div>
              <span className="text-[18px] font-mono text-[var(--fg-subtle)] flex-shrink-0 hidden sm:block">
                {event.location}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* OSS organizations */}
      <section className="py-10 border-b border-[var(--border)]">
        <SectionHeader label="oss organizations" />
        <div className="grid grid-cols-2 gap-2 max-[640px]:grid-cols-1">
          {OSS_ORGS.map((org, _i) => (
            <div
              key={_i}
              className="p-3 border border-[var(--border)] rounded-[8px]"
            >
              <div className="text-[18px] font-medium text-[var(--fg)] mb-0.5">{org.org}</div>
              <div className="text-[15px] text-[var(--fg-muted)] leading-[1.5]">{org.role}</div>
              <div className="text-[18px] font-mono text-[var(--fg-subtle)] mt-1.5">{org.period}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Speaking */}
      <section className="py-10">
        <SectionHeader label="speaking" />
        <div>
          {talks.map((talk) => (
            <div
              key={talk.id}
              className="py-4 border-b border-[var(--border)] first:pt-0 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="text-[15px] font-medium text-[var(--fg)]">{talk.title}</div>
                <span
                  className={`pill-base flex-shrink-0 ${
                    talk.type === "upcoming"
                      ? "pill-in-progress"
                      : "border-[var(--border-mid)] text-[var(--fg-muted)] bg-[var(--bg-surface)]"
                  }`}
                >
                  {talk.type}
                </span>
              </div>
              <div className="text-[18px] text-[var(--fg-muted)] mb-1">
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
          ))}
        </div>
      </section>
    </>
  );
}
