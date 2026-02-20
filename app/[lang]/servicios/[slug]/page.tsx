import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { site } from "@/content/site";
import { getServiceBySlug, services } from "@/content/services";
import { ServicePage } from "@/components/ServicePage/ServicePage";
import { JsonLd } from "@/components/Seo/JsonLd";

type Lang = "es" | "en";

export function generateStaticParams() {
  const langs: Lang[] = ["es", "en"];
  return langs.flatMap((lang) => services.map((s) => ({ lang, slug: s.slug })));
}

export function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  const canonical = `${site.url}/${params.lang}/servicios/${service.slug}`;

  return {
    title: service.title,
    description: service.lead,
    alternates: {
      canonical,
      languages: {
        es: `${site.url}/es/servicios/${service.slug}`,
        en: `${site.url}/en/servicios/${service.slug}`,
      },
    },
    openGraph: {
      title: `${service.title} — ${site.name}`,
      description: service.lead,
      url: canonical,
      siteName: site.name,
      type: "article",
      locale: params.lang === "es" ? "es_MX" : "en_US",
    },
  };
}

export default function ServiceSlugPage({ params }: { params: { lang: Lang; slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return notFound();

  const url = `${site.url}/${params.lang}/servicios/${service.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.lead,
          provider: { "@id": `${site.url}/#org` },
          areaServed: "MX",
          url,
        }}
      />
      <ServicePage lang={params.lang} service={service} />
    </>
  );
}