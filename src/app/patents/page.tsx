import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patents",
  description: "Indian patent IN202611004758 A1 - region-adaptive dog identification and management system.",
};

export default function PatentsPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
            intellectual property
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <h1
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          Patents &amp;
          <br />
          <span className="text-[var(--fg-subtle)]">Research.</span>
        </h1>
      </section>

      {/* Patent block */}
      <section className="py-10">
        <div className="p-6 border border-[var(--border)] rounded-[12px]">
          <div className="text-[18px] font-mono text-[var(--fg-subtle)] tracking-[0.08em] mb-3">
            IN202611004758 A1 · published apr 2026 · journal no. 16/2026
          </div>
          <h2 className="text-[18px] font-medium text-[var(--fg)] leading-[1.4] mb-2">
            A System and Method for Region-Adaptive Dog Identification and Management
          </h2>
          <div className="text-[15px] font-mono text-[var(--fg-muted)] mb-4">
            Indian Patent Office · Filed: Jan 2026 · Published: Apr 2026
          </div>
          <p className="text-[18px] text-[var(--fg-muted)] leading-[1.7]">
            End-to-end system covering geolocation-based region management, mobile field data
            collection, media validation and annotation pipeline, region-specific ML model training,
            real-time inference engine, and results analytics module. Operates through a centralized
            backend server using computer vision and object detection techniques.
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mt-4">
            {["G06K", "G06V", "G06F"].map((cls) => (
              <span
                key={cls}
                className="text-[15px] font-mono px-2 py-1 border border-[var(--border)] rounded-[8px] text-[var(--fg-subtle)]"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
