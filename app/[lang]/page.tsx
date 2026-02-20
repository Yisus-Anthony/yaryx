import { Hero } from "@/components/Hero/Hero";
import { JsonLd } from "@/components/Seo/JsonLd";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: `${site.url}/assets/logo.svg`,
        }}
      />
      <Hero />
    </>
  );
}