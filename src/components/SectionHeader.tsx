interface SectionHeaderProps {
  number?: string;
  label: string;
  rightLink?: {
    href: string;
    label: string;
  };
}

export function SectionHeader({ number, label, rightLink }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <span className="text-[18px] font-mono uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
        {number ? `${number} · ${label}` : label}
      </span>
      {rightLink && (
        <a
          href={rightLink.href}
          className="text-[15px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150 cursor-pointer"
        >
          {rightLink.label} →
        </a>
      )}
    </div>
  );
}
