import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.fresh-travel.example";
  return [
    { url: `${base}/vi`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/en`, changeFrequency: "weekly", priority: 0.9 },
  ];
}


