import type { MetadataRoute } from "next";

const baseUrl = "https://korea.avocadoss.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/color`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/hanbok`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/explore/gyeongbokgung`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/culture`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
