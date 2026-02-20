import type { Metadata } from "next";
import Script from "next/script";

import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/layout.css";

import { site } from "@/content/site";
import { Navbar } from "@/components/Navbar/Navbar";
import { Fab } from "@/components/Fab/Fab";
import { JsonLd } from "@/components/Seo/JsonLd";

type Lang = "es" | "en";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const lang = params.lang;
  const canonical = `${site.url}/${lang}`;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — Diseño de Páginas Web`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    verification: site.gscVerification ? { google: site.gscVerification } : undefined,
    alternates: {
      canonical,
      languages: {
        es: `${site.url}/es`,
        en: `${site.url}/en`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: site.name,
      title: site.name,
      description: site.description,
      locale: lang === "es" ? "es_MX" : "en_US",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const lang = params.lang;

  return (
    <html lang={lang}>
      <body>
        {/* Schema global */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${site.url}/#org`,
                name: site.name,
                url: site.url,
                logo: `${site.url}/assets/logo.svg`,
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                url: site.url,
                name: site.name,
                publisher: { "@id": `${site.url}/#org` },
                inLanguage: lang === "es" ? "es-MX" : "en-US",
              },
            ],
          }}
        />

        {/* GA4 */}
        {site.ga4Id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${site.ga4Id}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}

        <Navbar />
        {children}
        <Fab />
      </body>
    </html>
  );
}