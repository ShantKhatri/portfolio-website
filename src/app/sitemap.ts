import { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://prashantkhatri.com";

  const staticRoutes = [
    { url: base, priority: 1.0 },
    { url: `${base}/work`, priority: 0.9 },
    { url: `${base}/writing`, priority: 0.8 },
    { url: `${base}/community`, priority: 0.7 },
    { url: `${base}/about`, priority: 0.7 },
    { url: `${base}/patents`, priority: 0.6 },
    { url: `${base}/contact`, priority: 0.6 },
  ];

  const projectRoutes = PROJECTS.map((p) => ({
    url: `${base}/work/${p.slug}`,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes].map((r) => ({
    url: r.url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}