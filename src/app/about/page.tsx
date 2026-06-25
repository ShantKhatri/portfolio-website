import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { EDUCATION, CERTIFICATIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Prashant Khatri",
  description:
    "Prashant Khatri is a Platform Engineer and DevOps developer from Ahmedabad, India. CNCF Score contributor, 2x Google Summer of Code developer at Eclipse Foundation. Builder of open source infrastructure tools.",
  keywords: [
    "Prashant Khatri",
    "Platform Engineer India",
    "DevOps Engineer India",
    "Open Source Developer India",
    "CNCF Contributor",
    "Google Summer of Code",
    "Eclipse Foundation",
    "Kubernetes Developer",
    "Go Language Developer",
    "Ahmedabad Developer",
    "NPTEL Cloud Computing",
    "Linux Foundation"
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
            about
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <h1
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          Prashant
          <br />
          <span className="text-[var(--fg-subtle)]">Khatri.</span>
        </h1>
      </section>

      {/* Bio */}
      <section className="py-10 border-b border-[var(--border)]">
        <SectionHeader label="bio" />
        <p
          className="text-[18px] text-[var(--fg-muted)] leading-[1.9] max-w-[520px]"
        >
          Platform and OSS engineer based in Ahmedabad, India. I spend most of my time building
          infrastructure tooling, contributing to the CNCF Score ecosystem, and writing about what
          I learn at rootcause.hashnode.dev. Interested in distributed systems, developer tooling, and the
          gap between &ldquo;it works on my machine&rdquo; and &ldquo;it works in production.&rdquo;
        </p>
      </section>

      {/* Education */}
      <section className="py-10">
        <SectionHeader label="education" />
        <div>
          {EDUCATION.map((edu, i) => (
            <div
              key={i}
              className="flex gap-5 py-4 border-b border-[var(--border)] first:pt-0 last:border-0 last:pb-0"
            >
              <div className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[90px] flex-shrink-0 pt-0.5">
                {edu.period}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-medium text-[var(--fg)] mb-0.5">{edu.degree}</div>
                <div className="text-[18px] text-[var(--fg-muted)] mb-0.5">{edu.school}</div>
                <div className="text-[18px] font-mono text-[var(--fg-subtle)]">{edu.grade}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Certifications */}
      <section className="py-10">
        <SectionHeader label="certifications" />
        <div>
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={i}
              className="flex gap-5 py-4 border-b border-[var(--border)] first:pt-0 last:border-0 last:pb-0"
            >
              <div className="text-[18px] font-mono text-[var(--fg-subtle)] min-w-[90px] flex-shrink-0 pt-0.5">
                {cert.date}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-medium text-[var(--fg)] mb-0.5">{cert.name}</div>
                <div className="text-[18px] text-[var(--fg-muted)] mb-0.5">{cert.issuer}</div>
                {cert.credentialId && (
                  <div className="text-[18px] font-mono text-[var(--fg-subtle)]">
                    ID: {cert.credentialId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
