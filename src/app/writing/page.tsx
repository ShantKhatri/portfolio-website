import type { Metadata } from "next";
import { WritingTabs } from "@/components/WritingTabs";
import { getPosts } from "@/lib/hashnode";
import talksData from "../../../content/talks.json";
import type { Talk } from "@/types/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and talks on platform engineering, infrastructure, and OSS - published at rootcause.hashnode.dev.",
};

export default async function WritingPage() {
  const posts = await getPosts();
  const talks = talksData as Talk[];

  return (
    <>
      {/* Page header */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
            writing
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <h1
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          Articles &amp;
          <br />
          <span className="text-[var(--fg-subtle)]">Talks.</span>
        </h1>
      </section>

      <section className="py-10">
        <WritingTabs posts={posts} talks={talks} />
      </section>
    </>
  );
}
