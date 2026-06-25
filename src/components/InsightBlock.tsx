interface InsightBlockProps {
  label: string;
  text: string;
}

export function InsightBlock({ label, text }: InsightBlockProps) {
  return (
    <div
      className="my-4 pl-4 pr-4 py-3.5 border-l-2 border-[var(--border-mid)] bg-[var(--bg-surface)]"
      style={{ borderRadius: "0 8px 8px 0" }}
    >
      <p className="text-[18px] font-mono uppercase tracking-[0.08em] text-[var(--fg-subtle)] mb-1">
        {label}
      </p>
      <p className="text-[18px] text-[var(--fg-muted)] leading-[1.6]">{text}</p>
    </div>
  );
}
