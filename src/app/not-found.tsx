import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] mb-6">
        404
      </div>
      <h1
        className="font-medium leading-[0.95] mb-4"
        style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
      >
        Page not
        <br />
        <span className="text-[var(--fg-subtle)]">found.</span>
      </h1>
      <p className="text-[18px] text-[var(--fg-muted)] leading-[1.8] mb-8 max-w-[400px]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-[15px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        back to work
      </Link>
    </section>
  );
}
