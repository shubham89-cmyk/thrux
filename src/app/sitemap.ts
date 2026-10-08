import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/lib/site";
import { projects } from "@/content/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.ready) return [];
  return ["/", "/work", "/expertise", "/studio", "/contact", "/privacy", ...projects.map(project => `/work/${project.slug}`)].map(path => ({ url: new URL(path, siteUrl()).href, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.7 }));
}
