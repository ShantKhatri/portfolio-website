import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { JourneyEra, JourneyItem } from "@/components/Journey";
import { PROJECTS, EXPERIENCE, SKILLS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work & Journey",
  description:
    "My journey through platform engineering, OSS contributions, and infrastructure tooling.",
};

export default function WorkPage() {
  const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;
  const getExp = (orgIncludes: string) => EXPERIENCE.find((e) => e.org.includes(orgIncludes))!;

  return (
    <>
      {/* Page header */}
      <section className="py-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[15px] font-mono uppercase tracking-widest text-[var(--fg-subtle)] whitespace-nowrap">
            the journey
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <h1
          className="font-medium leading-[0.95]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-1px" }}
        >
          How I got
          <br />
          <span className="text-[var(--fg-subtle)]">Here.</span>
        </h1>
      </section>

      {/* The Timeline */}
      <section className="py-12 border-b border-[var(--border)] pl-1 sm:pl-2">
        
        {/* Era 1 */}
        <JourneyEra
          year="2025 – 2026"
          title="Building Platforms & Scaling Open Source"
          description="A shift towards infrastructure, developer tooling, and taking on leadership roles within global open-source communities. This era defined my focus on building things that other developers use."
        >
          {/* CNCF Score */}
          <JourneyItem
            title={getProject("score-hub-cli").name}
            subtitle="Creator & Maintainer"
            tags={getProject("score-hub-cli").tags}
            description={getProject("score-hub-cli").description}
            link={{ href: `/work/score-hub-cli`, label: "Read case study" }}
          />

          {/* DevCard */}
          <JourneyItem
            title={getProject("devcard").name}
            subtitle="Founder"
            tags={getProject("devcard").tags}
            description={getProject("devcard").description}
            link={{ href: `/work/devcard`, label: "Read case study" }}
          />

          {/* FlowProxy */}
          <JourneyItem
            title={getProject("flowproxy").name}
            subtitle="Infrastructure Engineering"
            tags={getProject("flowproxy").tags}
            description={getProject("flowproxy").description}
            link={{ href: `/work/flowproxy`, label: "Read case study" }}
          />

          {/* OpenSearch */}
          <JourneyItem
            title={getProject("opensearch-demo").name}
            subtitle="Conference Demo"
            tags={getProject("opensearch-demo").tags}
            description={getProject("opensearch-demo").description}
            link={{ href: `/work/opensearch-demo`, label: "Read case study" }}
          />

          {/* GSoC 2025 */}
          <JourneyItem
            title={getExp("Eclipse Adoptium").role}
            subtitle={getExp("Eclipse Adoptium").org}
            tags={["GSoC 2025", "Python", "ML"]}
            description={getExp("Eclipse Adoptium").description}
            period={getExp("Eclipse Adoptium").period}
            link={{ href: `/work/commithunter`, label: "Read case study" }}
          />

          {/* Code for GovTech 2025 */}
          <JourneyItem
            title={getExp("SampattiCard").role}
            subtitle={getExp("SampattiCard").org}
            tags={["DMP 2025", "Local LLMs"]}
            description={getExp("SampattiCard").description}
            period={getExp("SampattiCard").period}
          />

          {/* Shucon Tech */}
          <JourneyItem
            title={getExp("Shucon Tech").role}
            subtitle={getExp("Shucon Tech").org}
            tags={["Frontend", "React"]}
            description={getExp("Shucon Tech").description}
            period={getExp("Shucon Tech").period}
          />
        </JourneyEra>

        {/* Era 2 */}
        <JourneyEra
          year="2024"
          title="The Open Source Spark"
          description="My first deep dive into the world of distributed, global open-source teams. I spent the year writing automation frameworks, pushing PRs, and learning how large-scale codebases are maintained."
        >
          {/* GSoC 2024 */}
          <JourneyItem
            title={getExp("Eclipse 4diac").role}
            subtitle={getExp("Eclipse 4diac").org}
            tags={["GSoC 2024", "Java", "CI/CD"]}
            description={getExp("Eclipse 4diac").description}
            period={getExp("Eclipse 4diac").period}
          />

          {/* Code for GovTech 2024 */}
          <JourneyItem
            title={getExp("Shikshalokam").role}
            subtitle={getExp("Shikshalokam").org}
            tags={["DMP 2024", "Automation QA"]}
            description={getExp("Shikshalokam").description}
            period={getExp("Shikshalokam").period}
          />
          {/* Eclipse JKube */}
          <JourneyItem
            title={getExp("Eclipse JKube").role}
            subtitle={getExp("Eclipse JKube").org}
            tags={["Open Source", "Kubernetes"]}
            description={getExp("Eclipse JKube").description}
            period={getExp("Eclipse JKube").period}
          />
        </JourneyEra>

      </section>

      {/* Skills */}
      <section className="py-12">
        <SectionHeader label="technical stack" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {SKILLS.map((group) => (
            <div key={group.group}>
              <h3 className="text-[16px] font-medium text-[var(--fg)] mb-3">{group.group}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[14px] font-mono px-3 py-1.5 border border-[var(--border-mid)] rounded-[8px] text-[var(--fg-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
