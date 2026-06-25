import type { Metadata } from "next";
import { Mail, Linkedin, Github, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open to platform engineering, infrastructure, and OSS-adjacent roles. Remote and open to relocation.",
};

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
            contact
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <h1
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          Let&apos;s
          <br />
          <span className="text-[var(--fg-subtle)]">talk.</span>
        </h1>
      </section>

      {/* Content */}
      <section className="py-10">
        <p className="text-[18px] text-[var(--fg-muted)] leading-[1.8] mb-8 max-w-[480px]">
          Open to platform engineering, infrastructure, and OSS-adjacent roles. Remote-first. Open
          to relocation. Best reached by email.
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="mailto:prashantkhatri202@gmail.com"
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2.5 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-mid)] transition-colors duration-150"
          >
            <Mail size={13} strokeWidth={1.5} />
            email
          </a>
          <a
            href="https://linkedin.com/in/prashant-khatri"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2.5 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <Linkedin size={13} strokeWidth={1.5} />
            LinkedIn
            <ExternalLink size={11} strokeWidth={1.5} className="opacity-60" />
          </a>
          <a
            href="https://github.com/ShantKhatri"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2.5 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <Github size={13} strokeWidth={1.5} />
            GitHub
            <ExternalLink size={11} strokeWidth={1.5} className="opacity-60" />
          </a>
          {/* <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-1.5 text-[18px] px-4 py-2.5 border border-[var(--border-mid)] rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
          >
            <FileText size={13} strokeWidth={1.5} />
            resume
          </a> */}
        </div>
      </section>
    </>
  );
}
