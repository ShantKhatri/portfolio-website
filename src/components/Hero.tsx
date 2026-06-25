"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Github, Rss } from "lucide-react";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: "easeOut" as const, delay },
        };

  const lineExpand = prefersReducedMotion
    ? {}
    : {
        initial: { scaleX: 0, originX: 0 },
        animate: { scaleX: 1 },
        transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.1 },
      };

  return (
    <section className="py-12 md:py-16 border-b border-[var(--border)]">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
          platform &amp; oss engineer
        </span>
        <motion.div
          {...lineExpand}
          className="flex-1 h-px bg-[var(--border)]"
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* Name */}
      <motion.div {...fadeUp(0.2)} className="mb-3">
        <h1
          className="font-medium leading-[0.95]"
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            letterSpacing: "clamp(-1px, -0.04em, -2px)",
          }}
        >
          Prashant
          <br />
          <span className="text-[var(--fg-subtle)]">Khatri.</span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        {...fadeUp(0.35)}
        className="text-[18px] leading-[1.8] text-[var(--fg-muted)] max-w-[460px] mb-6"
      >
        I build developer tools, fix things in production OSS, and write about
        why they broke. Active in CNCF Score. 2× GSoC at Eclipse Foundation.
        Founder of DevCard.
      </motion.p>

      {/* Actions */}
      <motion.div
        {...fadeUp(0.5)}
        className="flex items-center gap-2 flex-wrap mb-5"
      >
        <Link
          href="/contact"
          className="text-[18px] font-sans px-4 py-2 bg-[var(--fg)] text-[var(--bg)] rounded-full hover:opacity-80 transition-opacity duration-150 cursor-pointer"
        >
          get in touch
        </Link>
        <Link
          href="https://github.com/ShantKhatri"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-mid)] transition-colors duration-150"
        >
          <Github size={13} strokeWidth={1.5} />
          ShantKhatri
          <ExternalLink size={11} strokeWidth={1.5} className="opacity-60" />
        </Link>
        <Link
          href="https://rootcause.hashnode.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
        >
          <Rss size={13} strokeWidth={1.5} />
          rootcause.hashnode.dev
          <ExternalLink size={11} strokeWidth={1.5} className="opacity-60" />
        </Link>
        {/* <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
        >
          <FileText size={13} strokeWidth={1.5} />
          resume
        </a> */}
      </motion.div>

      {/* Availability */}
      <motion.div {...fadeUp(0.55)} className="flex items-center gap-2">
        <div
          className="avail-dot w-[5px] h-[5px] rounded-full bg-[var(--green)]"
          aria-hidden="true"
        />
        <span className="text-[15px] font-mono text-[var(--green)]">
          open to work · Ahmedabad, India · remote &amp; relocation
        </span>
      </motion.div>
    </section>
  );
}
