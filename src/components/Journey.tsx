import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyEraProps {
  year: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function JourneyEra({ year, title, description, children }: JourneyEraProps) {
  return (
    <div className="relative pl-6 sm:pl-8 border-l border-[var(--border-mid)] pb-12 last:pb-0">
      {/* Era marker dot */}
      <div className="absolute top-0 -left-[4.5px] w-[8px] h-[8px] rounded-full bg-[var(--fg)] ring-4 ring-[var(--bg)]" />
      
      <div className="mb-8 relative -top-1.5">
        <span className="text-[12px] font-mono text-[var(--fg-subtle)] tracking-[0.1em] mb-2 block">
          {year}
        </span>
        <h2 className="text-[20px] sm:text-[24px] font-medium text-[var(--fg)] leading-tight mb-3">
          {title}
        </h2>
        <p className="text-[16px] text-[var(--fg-muted)] leading-[1.8] max-w-[540px]">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

interface JourneyItemProps {
  title: string;
  subtitle: string;
  tags?: string[];
  description: string;
  period?: string;
  link?: { href: string; label: string; isExternal?: boolean };
}

export function JourneyItem({ title, subtitle, tags = [], description, period, link }: JourneyItemProps) {
  const isClickable = !!link;
  
  const CardContent = () => (
    <div className={cn(
      "p-5 rounded-[12px] border transition-all duration-200",
      isClickable 
        ? "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--fg-subtle)] group cursor-pointer" 
        : "border-[var(--border)] bg-[var(--bg)]"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-[16px] font-medium text-[var(--fg)] mb-1 group-hover:text-[var(--fg)] transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-[var(--fg-subtle)]">
            <span>{subtitle}</span>
            {period && (
              <>
                <span className="opacity-40">·</span>
                <span className="font-mono text-[13px]">{period}</span>
              </>
            )}
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag} className="text-[11px] font-mono px-2 py-0.5 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-[14px] text-[var(--fg-muted)] leading-[1.7] mb-4 line-clamp-3">
        {description}
      </p>

      {/* Clear affordance for links */}
      {isClickable && (
        <div className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">
          {link.label}
          {link.isExternal ? (
             <ExternalLink size={12} strokeWidth={1.5} />
          ) : (
             <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      )}
    </div>
  );

  if (isClickable) {
    if (link.isExternal) {
      return (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] rounded-[12px]">
          <CardContent />
        </a>
      );
    }
    return (
      <Link href={link.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] rounded-[12px]">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
