import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return site.ready ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: new URL("/sitemap.xml", siteUrl()).href } : { rules: { userAgent: "*", disallow: "/" } };
}
