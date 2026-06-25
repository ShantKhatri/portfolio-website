import Parser from "rss-parser";
import type { HashnodePost } from "@/types/hashnode";

const HASHNODE_RSS_URL = "https://rootcause.hashnode.dev/rss.xml";

type CustomItem = {
  "content:encoded": string;
  enclosure?: { url: string };
};

const parser = new Parser<unknown, CustomItem>({
  customFields: {
    item: ["content:encoded", "enclosure"],
  },
});

function calculateReadTime(text: string): number {
  if (!text) return 1;
  const words = text.replace(/<[^>]*>?/gm, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function getPosts(): Promise<HashnodePost[]> {
  try {
    const feed = await parser.parseURL(HASHNODE_RSS_URL);

    if (!feed.items || feed.items.length === 0) return [];

    return feed.items.map((item) => {
      // The slug can be derived from the link which looks like: https://rootcause.hashnode.dev/slug
      const url = item.link || "";
      const slug = url.split("/").pop() || "";
      const content = item["content:encoded"] || item.content || "";
      
      let coverImage: { url: string } | undefined = undefined;
      if (item.enclosure && item.enclosure.url) {
        coverImage = { url: item.enclosure.url };
      }

      return {
        title: item.title || "Untitled",
        brief: item.contentSnippet || "",
        slug,
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        readTimeInMinutes: calculateReadTime(content),
        coverImage,
        url,
      };
    });
  } catch (error) {
    console.error("Failed to fetch Hashnode RSS:", error);
    return [];
  }
}
