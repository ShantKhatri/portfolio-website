import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { NowFeed } from "@/components/NowFeed";
import { SectionHeader } from "@/components/SectionHeader";
import { JourneyEra, JourneyItem } from "@/components/Journey";
import { getPosts } from "@/lib/hashnode";
import { PROJECTS, EXPERIENCE, RECOGNITION } from "@/lib/data";
import type { NowItem } from "@/types/content";
import nowData from "../../content/now.json";
import talksData from "../../content/talks.json";
import { Mail, Linkedin, Github, FileText, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Talk } from "@/types/content";

export const metadata: Metadata = {
  title: "Platform Engineer & OSS Contributor",
  description:
    "Platform and OSS engineer based in Ahmedabad, India. 2× GSoC at Eclipse Foundation. Active in CNCF Score. Founder of DevCard. Open to work.",
};

export default async function HomePage() {
  const posts = await getPosts();
  const nowItems = nowData as NowItem[];
  const talks = talksData as Talk[];

  const recentPosts = posts.slice(0, 2);
  const recentTalk = talks.find((t) => t.type === "delivered");

  const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;
  const getExp = (orgIncludes: string) => EXPERIENCE.find((e) => e.org.includes(orgIncludes))!;

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* 01 · now */}
      {nowItems.length > 0 && (
        <section className="py-10 border-b border-[var(--border)]">
          <SectionHeader number="01" label="now" />
          <NowFeed items={nowItems} />
        </section>
      )}

      {/* 02 · the journey */}
      <section className="py-10 border-b border-[var(--border)]">
        <SectionHeader
          number="02"
          label="selected milestones"
          rightLink={{ href: "/work", label: "full journey" }}
        />
        <div className="pl-1 sm:pl-2 mt-4">
          <JourneyEra
            year="2025"
            title="Platforms & Scale"
            description="Leading development on infrastructure tools and founding open-source platforms."
          >
            <JourneyItem
              title={getProject("score-hub-cli").name}
              subtitle="Creator & Maintainer"
              tags={getProject("score-hub-cli").tags}
              description={getProject("score-hub-cli").description}
              link={{ href: `/work/score-hub-cli`, label: "Read case study" }}
            />
            <JourneyItem
              title={getProject("devcard").name}
              subtitle="Founder"
              tags={getProject("devcard").tags}
              description={getProject("devcard").description}
              link={{ href: `/work/devcard`, label: "Read case study" }}
            />
            <JourneyItem
              title={getExp("Eclipse Adoptium").role}
              subtitle={getExp("Eclipse Adoptium").org}
              tags={["GSoC 2025"]}
              description={getExp("Eclipse Adoptium").description}
              period={getExp("Eclipse Adoptium").period}
              link={{ href: `/work/commithunter`, label: "Read case study" }}
            />
          </JourneyEra>
        </div>
      </section>

      {/* 04 · recognition */}
      <section className="py-10 border-b border-[var(--border)]">
        <SectionHeader number="03" label="recognition" />
        <div className="grid grid-cols-3 gap-2 max-[640px]:grid-cols-2 max-[400px]:grid-cols-1">
          {RECOGNITION.map((r, i) => (
            <div
              key={i}
              className="p-3 border border-[var(--border)] rounded-[8px] bg-[var(--bg)]"
            >
              <div className="text-[18px] font-medium text-[var(--fg)] mb-0.5">{r.org}</div>
              <div className="text-[15px] text-[var(--fg-muted)] leading-[1.5]">{r.role}</div>
              <div className="text-[18px] font-mono text-[var(--fg-subtle)] mt-1.5">{r.year}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 · writing */}
      <section className="py-10 border-b border-[var(--border)]">
        <SectionHeader
          number="04"
          label="writing"
          rightLink={{ href: "/writing", label: "all writing" }}
        />
        <div>
          {recentPosts.map((post, i) => (
            <a
              key={post.slug}
              href={`https://rootcause.hashnode.dev/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 py-3.5 border-b border-[var(--border)] first:pt-0 last:border-0 hover-row rounded-sm group cursor-pointer transition-colors duration-150 px-1 -mx-1"
            >
              <span className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[24px] flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium text-[var(--fg)] mb-0.5">{post.title}</div>
                <div className="text-[18px] font-mono text-[var(--fg-subtle)]">
                  rootcause.hashnode.dev · {formatDate(post.publishedAt)} · {post.readTimeInMinutes} min read
                </div>
              </div>
              <span className="pill-base flex-shrink-0 border-[var(--border-mid)] text-[var(--fg-muted)] bg-[var(--bg-surface)]">
                article
              </span>
            </a>
          ))}

          {recentTalk && (
            <div className="flex items-center gap-4 py-3.5 first:pt-0 px-1 -mx-1">
              <span className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[24px] flex-shrink-0">
                {String(recentPosts.length + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium text-[var(--fg)] mb-0.5">{recentTalk.title}</div>
                <div className="text-[18px] font-mono text-[var(--fg-subtle)]">
                  talk · {recentTalk.event} · {recentTalk.date}
                </div>
              </div>
              <span className="pill-base flex-shrink-0 border-[var(--border-mid)] text-[var(--fg-muted)] bg-[var(--bg-surface)]">
                talk
              </span>
            </div>
          )}

          {recentPosts.length === 0 && !recentTalk && (
            <p className="text-[15px] text-[var(--fg-subtle)]">no posts yet - check back soon.</p>
          )}
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-12">
        <h2
          className="font-medium leading-tight mb-2"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px" }}
        >
          Let&apos;s
          <br />
          <span className="text-[var(--fg-subtle)]">talk.</span>
        </h2>
        <p className="text-[15px] text-[var(--fg-muted)] leading-[1.7] mb-5 max-w-[400px]">
          Open to platform engineering, infrastructure, and OSS-adjacent roles. Remote and open to
          relocation. Best reached by email.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="mailto:prashantkhatri202@gmail.com"
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <Mail size={13} strokeWidth={1.5} />
            email
          </a>
          <a
            href="https://linkedin.com/in/prashant-khatri"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <Linkedin size={13} strokeWidth={1.5} />
            LinkedIn
            <ExternalLink size={11} strokeWidth={1.5} className="opacity-60" />
          </a>
          <a
            href="https://github.com/ShantKhatri"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <Github size={13} strokeWidth={1.5} />
            GitHub
            <ExternalLink size={11} strokeWidth={1.5} className="opacity-60" />
          </a>
          {/* <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <FileText size={13} strokeWidth={1.5} />
            resume
          </a> */}
        </div>
      </section>
    </>
  );
}