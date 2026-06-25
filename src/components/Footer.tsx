import Link from "next/link";

export function Footer() {
  return (
    <footer className="max-w-[720px] mx-auto px-5 py-5 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
      <span className="text-[15px] font-mono text-[var(--fg-subtle)]">
        prashant khatri · 2026
      </span>
      <div className="flex items-center gap-5">
        <span className="text-[15px] font-mono text-[var(--fg-subtle)]">
          built with next.js
        </span>
        <Link
          href="https://github.com/ShantKhatri"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-mono text-[var(--fg-subtle)] hover:text-[var(--fg-muted)] transition-colors duration-150"
        >
          source on github
        </Link>
      </div>
    </footer>
  );
}
