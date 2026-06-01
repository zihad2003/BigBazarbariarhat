import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://bigbazarbariarhat.pages.dev", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://bigbazarbariarhat.pages.dev/products", lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: "https://bigbazarbariarhat.pages.dev/categories", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];
}
