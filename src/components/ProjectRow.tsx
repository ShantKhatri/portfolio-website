import Link from "next/link";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

interface ProjectRowProps {
  project: Project;
  index: number;
  showDescription?: boolean;
}

const STATUS_CLASSES: Record<Project["status"], string> = {
  live: "pill-live",
  "in-progress": "pill-in-progress",
  shipped: "pill-shipped",
  published: "pill-published",
};

const STATUS_LABELS: Record<Project["status"], string> = {
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

export function ProjectRow({ project, index, showDescription = true }: ProjectRowProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="flex items-start gap-4 py-4 border-b border-[var(--border)] last:border-0 first:pt-0 last:pb-0 hover-row rounded-sm cursor-pointer group transition-colors duration-150 px-1 -mx-1"
    >
      {/* Number */}
      <span className="text-[15px] font-mono text-[var(--fg-subtle)] min-w-[24px] flex-shrink-0 pt-0.5">
        {String(index).padStart(2, "0")}
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="text-[18px] font-medium text-[var(--fg)] mb-0.5 group-hover:text-[var(--fg)] transition-colors">
          {project.name}
        </div>
        {showDescription && (
          <div className="text-[18px] text-[var(--fg-muted)] leading-[1.6] mb-1.5 line-clamp-2">
            {project.description}
          </div>
        )}
        <div className="text-[18px] font-mono text-[var(--fg-subtle)] truncate">
          {project.stack.join(" · ")}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={cn("pill-base", STATUS_CLASSES[project.status])}>
          {STATUS_LABELS[project.status]}
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={cn("pill-base", TAG_CLASSES[tag])}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
