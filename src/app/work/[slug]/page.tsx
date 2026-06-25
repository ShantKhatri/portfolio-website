import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { InsightBlock } from "@/components/InsightBlock";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_CLASSES: Record<string, string> = {
  live: "pill-live",
  "in-progress": "pill-in-progress",
  shipped: "pill-shipped",
  published: "pill-published",
};

const STATUS_LABELS: Record<string, string> = {
  live: "live",
  "in-progress": "in progress",
  shipped: "shipped",
  published: "published",
};

const TAG_CLASSES: Record<string, string> = {
  OSS: "tag-oss",
  Infra: "tag-infra",
  Research: "tag-research",
};

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) notFound();

  const nameParts = project.name.split(/(?=[A-Z])|(?=\s)/);
  const firstName =
    nameParts.length > 1
      ? nameParts.slice(0, -1).join("")
      : project.name.slice(0, -1);
  const lastChar =
    nameParts.length > 1 ? nameParts[nameParts.length - 1] : project.name.slice(-1);

  return (
    <>
      {/* Back link */}
      <div className="pt-8 pb-0">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-[15px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          all projects
        </Link>
      </div>

      {/* Header */}
      <section className="pb-8 border-b border-[var(--border)]">
        <div className="text-[15px] font-mono text-[var(--fg-subtle)] tracking-[0.1em] mb-2">
          project · {String(project.number).padStart(2, "0")}
        </div>
        <h1
          className="font-medium leading-[0.95] mb-3"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          {firstName}
          <span className="text-[var(--fg-subtle)]">{lastChar}.</span>
        </h1>
        <p className="text-[18px] text-[var(--fg-muted)] leading-[1.8] max-w-[480px] mb-5">
          {project.tagline}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("pill-base", STATUS_CLASSES[project.status])}>
            {STATUS_LABELS[project.status]}
          </span>
          {project.tags.map((tag) => (
            <span key={tag} className={cn("pill-base", TAG_CLASSES[tag])}>
              {tag}
            </span>
          ))}
          <span className="text-[18px] font-mono text-[var(--fg-subtle)] ml-1">
            {project.stack.join(" · ")}
          </span>
        </div>
      </section>

      {/* Body */}
      <section className="py-8">
        {/* Main description */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-[15px] leading-[1.8] text-[var(--fg-muted)] mb-8 prose-p:my-4 prose-a:text-[var(--fg)] prose-a:underline-offset-4 prose-a:decoration-[var(--border-mid)] hover:prose-a:decoration-[var(--fg)] prose-code:text-[var(--fg)] prose-code:bg-[var(--bg-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.description}
          </ReactMarkdown>
        </div>

        {/* Additional sections */}
        {project.sections?.map((section, i) => (
          <div key={i} className="mb-6">
            <h2 className="text-[15px] font-mono uppercase tracking-[0.1em] text-[var(--fg-subtle)] mb-2 mt-8">
              {section.title}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-[15px] leading-[1.8] text-[var(--fg-muted)] mb-8 prose-p:my-4 prose-a:text-[var(--fg)] prose-a:underline-offset-4 prose-a:decoration-[var(--border-mid)] hover:prose-a:decoration-[var(--fg)] prose-code:text-[var(--fg)] prose-code:bg-[var(--bg-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none prose-ul:my-4 prose-li:my-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.body}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Key decision block */}
        {project.keyDecision && (
          <InsightBlock
            label={project.keyDecision.label}
            text={project.keyDecision.text}
          />
        )}

        {/* Stack */}
        <div className="mt-6 mb-6">
          <h2 className="text-[15px] font-mono uppercase tracking-[0.1em] text-[var(--fg-subtle)] mb-3">
            stack
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <span
                key={item}
                className="text-[18px] font-mono px-2.5 py-1 border border-[var(--border)] rounded-[8px] text-[var(--fg-muted)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(project.github || project.live) && (
          <div className="flex items-center gap-2 flex-wrap mt-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[15px] font-mono px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
              >
                <Github size={12} strokeWidth={1.5} />
                source
                <ExternalLink size={10} strokeWidth={1.5} className="opacity-60" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[15px] font-mono px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
              >
                <ExternalLink size={12} strokeWidth={1.5} />
                live
              </a>
            )}
          </div>
        )}
      </section>
    </>
  );
}
