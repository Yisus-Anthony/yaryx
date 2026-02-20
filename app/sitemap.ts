import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const langs: Array<"es" | "en"> = ["es", "en"];

  const out: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    out.push({ url: `${site.url}/${lang}`, lastModified: now });
    out.push({ url: `${site.url}/${lang}/contacto`, lastModified: now });

    for (const s of services) {
      out.push({ url: `${site.url}/${lang}/servicios/${s.slug}`, lastModified: now });
    }
  }

  return out;
}