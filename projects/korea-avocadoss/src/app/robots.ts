import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/saved/",
          "/credits/checkout",
          "/hanbok/results/",
          "/color/results/",
          "/culture/saju/results/",
        ],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/saved/",
          "/credits/checkout",
          "/hanbok/results/",
          "/color/results/",
          "/culture/saju/results/",
        ],
      },
    ],
    sitemap: "https://korea.avocadoss.co.kr/sitemap.xml",
    host: "https://korea.avocadoss.co.kr",
  };
}
