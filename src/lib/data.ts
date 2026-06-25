import type { Project, Experience, Recognition, Education, ConferenceEvent, OSSOrg, Certification } from "@/types/content";

export const PROJECTS: Project[] = [
  {
    slug: "flowproxy",
    number: 1,
    name: "FlowProxy",
    tagline: "Self-hosted reverse proxy and API gateway built in Go. Production-grade observability, security-hardened containers, and zero-downtime config reload.",
    description: "Self-hosted reverse proxy and API gateway with per-client rate limiting, real-time analytics, and anomaly alerting. Sits in front of any HTTP service and enforces traffic policies without touching application code.",
    status: "shipped",
    stack: ["Go", "Redis", "PostgreSQL", "Docker Compose", "Prometheus", "Grafana", "Trivy"],
    tags: ["Infra"],
    github: "https://github.com/ShantKhatri/flowproxy",
    keyDecision: {
      label: "key decision",
      text: "Chose atomic Lua scripts over Redis transactions for rate limiting - single round-trip, no watch/multi/exec overhead, guaranteed atomicity under concurrent requests from the same client.",
    },
    sections: [
      {
        title: "what it does",
        body: `FlowProxy sits in front of any HTTP service and enforces traffic policies without touching your application code:
* **Per-client, per-route rate limiting** - Redis sliding window (sorted sets + atomic Lua script)
* **Dynamic config** - rate limits stored in Postgres, hot-reloaded every 30s without restart
* **Async request logging** - buffered channel -> batch insert to Postgres (zero latency impact)
* **Anomaly detection** - background worker fires Slack alerts on traffic spikes, error surges, abuse
* **Prometheus metrics** - \`/metrics\` endpoint with 7 metrics, pre-built Grafana dashboard
* **Graceful shutdown** - drains in-flight requests, flushes log buffer, exits cleanly on SIGTERM`,
      },
      {
        title: "architecture",
        body: `Every request passes through this middleware chain in order:
\`\`\`text
Client -> :8080 -> [Logger -> RateLimit -> Metrics -> ReverseProxy] -> Upstream
                      |          |          |
                   Postgres    Redis    Prometheus -> Grafana
                   (logs)   (counters)  (metrics)
                      ^
                  Alert Worker (polls anomalies -> Slack)
\`\`\``
      },
      {
        title: "security",
        body: `* **Non-root containers** - distroless runtime, \`USER nonroot:nonroot\`
* **Read-only filesystem** - \`read_only: true\` on all Go services
* **No secrets in images** - all credentials via \`.env\` (git-ignored)
* **Network isolation** - Postgres and Redis have no published ports
* **Resource limits** - CPU and memory caps on every service
* **CVE scanning** - GitHub Actions runs Trivy on every push`,
      },
      {
        title: "observability",
        body: `Full Prometheus metrics exposed at \`/metrics\`: \`flowproxy_requests_total\`, \`flowproxy_rate_limited_total\`, \`flowproxy_upstream_latency_seconds\`, \`flowproxy_active_connections\`. 
Grafana dashboards show:
* Requests/sec
* Rate Limit Hits/sec
* Active Connections
* Upstream Latency (p50/p95/p99)
* Error Rate %
* Top Rate-Limited Clients`,
      },
    ],
  },
  {
    slug: "devcard",
    number: 2,
    name: "DevCard",
    tagline: "Open source developer profile exchange platform. Founded and scaled to 50+ contributors and GSSoC 2026 participating org status.",
    description: "Open source developer profile exchange platform built as a monorepo - Fastify backend, React web, React Native mobile, pnpm workspaces. 36 stars, 126 forks, 55+ contributors. GSSoC 2026 participating org. Sustained 30 PRs/day at peak contributor volume.",
    status: "live",
    stack: ["Fastify", "React", "React Native", "pnpm", "GitHub Actions", "Docker"],
    tags: ["OSS"],
    // live: "https://devcard.cc",
    github: "https://github.com/Dev-Card/DevCard",
    keyDecision: {
      label: "key decision",
      text: "pnpm workspaces chosen for the monorepo to enforce strict dependency isolation between packages while sharing devDependencies - avoids the phantom dependency problem common in npm/yarn monorepos.",
    },
    sections: [
      {
        title: "what it does",
        body: "DevCard lets developers create a profile card that captures their GitHub activity, top projects, and tech stack - shareable as a URL or embedded widget. The platform runs across web and mobile from a single monorepo.",
      },
      {
        title: "community",
        body: "Founded and designed the project architecture. Managing PR reviews, issue triage, GitHub Actions CI/CD. Sustained 30 PRs/day at peak contributor volume during GSSoC. 50+ contributors from across the world.",
      },
    ],
  },
  {
    slug: "score-hub-cli",
    number: 3,
    name: "score-hub-cli",
    tagline: "Krew-style CLI package manager for CNCF Score community provisioners. Replaces 140+ character raw GitHub URLs with a single install command.",
    description: "Replaces 140+ character raw GitHub URLs with `score-hub install <name>`. Resolver interface abstraction enabling pluggable backends. HTTPStaticResolver for GitHub, LocalResolver for filesystem. Named registry federation, lockfile with checksum verification, automatic platform detection.",
    status: "in-progress",
    stack: ["Go", "CNCF Score", "Krew-style architecture"],
    tags: ["Infra", "OSS"],
    github: "https://github.com/ShantKhatri/score-hub-cli",
    keyDecision: {
      label: "key decision",
      text: "Resolver interface abstraction means any backend (GitHub, S3, private registry, local) is swappable without changing the install command - same pattern as Go's io.Reader.",
    },
    sections: [
      {
        title: "the problem",
        body: `Installing CNCF Score provisioners requires copying 140+ character raw GitHub URLs. There is no package manager, no versioning, and no checksum verification. score-hub-cli is to community-provisioners what Krew is to kubectl plugins - a single install command replaces the raw URL:
\`\`\`bash
# Before score-hub:
score-k8s init --provisioners \\
  https://raw.githubusercontent.com/score-spec/community-provisioners/main/dapr-pubsub/score-k8s/10-redis-dapr-pubsub.provisioners.yaml

# After score-hub:
score-hub install dapr-pubsub --variant redis
\`\`\``,
      },
      {
        title: "architecture",
        body: `Resolver interface abstraction enables pluggable backends - \`HTTPStaticResolver\` for GitHub, \`LocalResolver\` for filesystem. Any backend (GitHub, S3, private registry, local) is swappable without changing the install command, following the same pattern as Go's \`io.Reader\`.
* Named registry federation via \`~/.score-hub/config.yaml\`
* \`.score-hub.lock\` file with checksum verification for reproducible installs
* Automatic platform detection (k8s vs compose)`,
      },
      {
        title: "quick start",
        body: `\`\`\`bash
# 1. Install score-hub
go install github.com/ShantKhatri/score-hub-cli@latest

# 2. Search for provisioners
score-hub search

# 3. Install into your Score project
score-hub install dapr-pubsub --variant redis
\`\`\``
      },
      {
        title: "status",
        body: "POC green-flagged by maintainer Mathieu Benoit at the June 4 Score community call. Official feature request will be created by the Score team.",
      },
    ],
  },
  {
    slug: "commithunter",
    number: 4,
    name: "CommitHunter",
    tagline: "Automated CI/CD tool for identifying test-breaking Git commits. GSoC 2025 at Eclipse Adoptium.",
    description: "Automated CI/CD tool using rule-based logic and ML models for commit classification. Integrated into Jenkins pipelines and GitHub Actions workflows. NLP-based commit message analysis. Reduced manual debugging effort across Eclipse repositories.",
    status: "shipped",
    stack: ["Python", "NLP", "ML", "MongoDB", "Jenkins", "GitHub Actions", "GitHub APIs"],
    tags: ["OSS", "Research"],
    github: "https://github.com/adoptium/commithunter",
    sections: [
      {
        title: "what it does",
        body: "CommitHunter automatically identifies which Git commit broke a test suite in CI. Uses rule-based logic for deterministic cases and ML models for ambiguous commit classification. NLP-based commit message analysis adds context.",
      },
      {
        title: "integration",
        body: "Integrated into Jenkins pipelines and GitHub Actions workflows across Eclipse Adoptium repositories. MongoDB stores commit metadata for analysis and training data. Reduced manual debugging effort significantly across the org.",
      },
    ],
  },
  {
    slug: "opensearch-demo",
    number: 5,
    name: "OpenSearch hybrid search",
    tagline: "Production-grade hybrid search over a 19K+ product dataset. BM25 + k-NN vector search combined via Reciprocal Rank Fusion. Demonstrated at OpenSearch Meetup Ahmedabad.",
    description: "BM25 + k-NN vector search combined via Reciprocal Rank Fusion (RRF). Full CDC pipeline: PostgreSQL → Debezium → Kafka → OpenSearch. 19,000+ product dataset. Demonstrated at OpenSearch Meetup Ahmedabad as a live talk.",
    status: "shipped",
    stack: ["OpenSearch", "Kafka", "Debezium", "PostgreSQL", "Python"],
    tags: ["Infra", "Research"],
    keyDecision: {
      label: "key decision",
      text: "RRF outperforms weighted-sum combination in practice because it doesn't require tuning per-query score scales - rank positions are stable across different query types.",
    },
    sections: [
      {
        title: "search architecture",
        body: "Combines BM25 keyword search with k-NN vector search using Reciprocal Rank Fusion to merge result sets. The CDC pipeline keeps OpenSearch in sync with PostgreSQL in near real-time: PostgreSQL → Debezium → Kafka → OpenSearch connector.",
      },
      {
        title: "dataset",
        body: "Built over a 19,000+ product dataset. Demonstrated as a live talk at OpenSearch Meetup Ahmedabad, walking through the full pipeline from CDC setup to hybrid query tuning.",
      },
    ],
  },
];

export const EXPERIENCE: Experience[] = [
  {
    period: "May - Sep 2025",
    role: "Open Source Developer",
    org: "Google Summer of Code · Eclipse Adoptium",
    badge: "GSoC 2025",
    description: "Designed and built CommitHunter, an automated CI/CD tool using rule-based logic and ML models to identify test-breaking Git commits. Integrated into Jenkins pipelines and GitHub Actions. Reduced manual debugging effort by automating test triage across Eclipse repositories using Python, GitHub APIs, NLP, and MongoDB.",
  },
  {
    period: "May - Sep 2025",
    role: "Open Source Developer",
    org: "Code for GovTech · SampattiCard",
    badge: "DMP 2025",
    description: "Engineered infrastructure for a privacy-first AI desktop assistant using local LLM processing, P2P caching, and OCR for low-connectivity environments. Automated deployment workflows and environment setup using Bash and Docker. Implemented multilingual support and accessibility features using BrowserUse and SLMs.",
  },
  {
    period: "Jan 2025 - Jan 2026",
    role: "Software Engineer",
    org: "Shucon Tech",
    badge: "contract",
    description: "Built and deployed the frontend for a Hospital Management System, coordinating with backend teams for smooth, reliable releases. Implemented responsive UI modules for patient records, billing, and scheduling using React.js and MUI. Troubleshot build and deployment issues across environments to ensure high availability.",
  },
  {
    period: "Sep 2024 - Mar 2025",
    role: "Top Contributor",
    org: "Eclipse JKube",
    badge: "Open Source",
    description: "Consistently ranked as a top contributor to Eclipse JKube, enhancing Kubernetes and OpenShift integration tooling for Java applications. Contributed across the core library, documentation, and CI infrastructure.",
  },
  {
    period: "May - Sep 2024",
    role: "Open Source Developer",
    org: "Google Summer of Code · Eclipse 4diac",
    badge: "GSoC 2024",
    description: "Automated test suites using Eclipse SWTBot, Java, JUnit, and Maven within CI workflows, improving build reliability and error detection. Collaborated with a globally distributed team and maintained test infrastructure documentation to support contributor onboarding.",
  },
  {
    period: "May - Sep 2024",
    role: "Open Source Developer",
    org: "Code for GovTech · Shikshalokam",
    badge: "DMP 2024",
    description: "Built a cross-platform automation testing framework using Playwright, TestNG, and Log4j, reducing manual QA effort across mobile and web pipelines. Automated P1 use case workflows to ensure release stability and improved code reuse through modular framework design.",
  },
];

export const RECOGNITION: Recognition[] = [
  { org: "Google Summer of Code", role: "2× Eclipse Foundation", year: "2024 · 2025" },
  { org: "CNCF Score", role: "Active contributor", year: "2026 – present" },
  { org: "Patent IN2026", role: "Co-inventor", year: "published 2026" },
  { org: "BazelCon 2024", role: "Linux Foundation sponsored", year: "Mountain View, CA" },
  { org: "OpenSearchCon", role: "Seoul & Tokyo · selected", year: "2025" },
  { org: "OSD India 2026", role: "Volunteer", year: "DAIICT Gandhinagar" },
];

export const EDUCATION: Education[] = [
  {
    period: "2024 – 2025",
    degree: "PG Certificate in Data Science & AI",
    school: "IIIT Bangalore",
    grade: "CGPA: 9.47",
  },
  {
    period: "2021 – 2025",
    degree: "B.Tech in Computer Engineering",
    school: "Jamia Millia Islamia University",
    grade: "CGPA: 7.75",
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: "The Structured Query Language (SQL)",
    issuer: "University of Colorado Boulder",
    date: "Dec 2025",
    credentialId: "1TV0AMNGDOIF",
  },
  {
    name: "Pricing Options with Mathematical Models",
    issuer: "Caltech",
    date: "Apr 2025",
    credentialId: "DSFJSDCLAPFJ",
  },
  {
    name: "Green Software for Practitioners (LFC131)",
    issuer: "The Linux Foundation",
    date: "Apr 2025",
  },
  {
    name: "Cloud Computing",
    issuer: "NPTEL",
    date: "May 2024",
    credentialId: "NPTEL24CS17S354304215",
  },
  {
    name: "Blockchain and its Applications",
    issuer: "NPTEL",
    date: "May 2024",
    credentialId: "NPTEL24CS15S954300200",
  },
  {
    name: "Privacy and Security in Online Social Media",
    issuer: "NPTEL",
    date: "May 2024",
    credentialId: "NPTEL24CS04S1154303742",
  },
];

export const CONFERENCES: ConferenceEvent[] = [
  { year: "2026", name: "Open Source Day India", role: "Volunteer", location: "DAIICT Gandhinagar" },
  { year: "2025", name: "Open Source Summit + AI_dev + Automotive Linux Summit Japan", role: "Attendee", location: "Tokyo, Japan" },
  { year: "2025", name: "OpenSearchCon Japan", role: "Linux Foundation sponsored", location: "Tokyo" },
  { year: "2025", name: "OpenSearchCon Korea", role: "Linux Foundation sponsored", location: "Seoul" },
  { year: "2024", name: "KubeCon + CloudNativeCon India", role: "Attendee", location: "Delhi, India" },
  { year: "2024", name: "BazelCon", role: "Linux Foundation sponsored", location: "Mountain View, CA" },
];

export const OSS_ORGS: OSSOrg[] = [
  { org: "CNCF Score ecosystem", role: "Active contributor", period: "2026 - present" },
  { org: "DevCard", role: "Founder & Org Admin (GSSoC 2026)", period: "2026 - present" },
  { org: "GSoC - Eclipse Adoptium", role: "Open Source Developer", period: "May - Sep 2025" },
  { org: "GSoC - Eclipse 4diac", role: "Open Source Developer", period: "May - Sep 2024" },
  { org: "DMP - SampattiCard", role: "Open Source Developer", period: "May - Sep 2025" },
  { org: "DMP - Shikshalokam", role: "Open Source Developer", period: "May - Sep 2024" },
  { org: "Eclipse JKube", role: "Top Contributor", period: "Sep 2024 - Mar 2025" },
];

export const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Platform & DevOps",
    items: ["Linux", "Docker", "Kubernetes", "Helm", "ArgoCD", "CI/CD", "GitHub Actions", "Nginx"],
  },
  {
    group: "Cloud & IaC",
    items: ["AWS", "GCP", "Terraform", "Ansible", "Pulumi", "CNCF Score"],
  },
  {
    group: "Observability & APM",
    items: ["Prometheus", "Grafana", "OpenTelemetry", "ELK Stack", "Structured Logging"],
  },
  {
    group: "Languages",
    items: ["Go", "Python", "TypeScript", "Java", "Bash", "Lua"],
  },
  {
    group: "Data & Messaging",
    items: ["PostgreSQL", "Redis", "Kafka", "MongoDB", "OpenSearch", "Debezium"],
  },
  {
    group: "Frameworks & Automation",
    items: ["Fastify", "React", "Next.js", "Playwright", "SWTBot", "TestNG", "pnpm workspaces"],
  },
];
