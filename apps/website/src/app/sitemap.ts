import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/url";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
