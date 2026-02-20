export const site = {
  name: "Yaryx",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yaryx.com",
  description: "Diseño web, SEO, diseño gráfico, gestión de redes sociales, logos, marketing y anuncios.",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/0000000000",
  formspreeEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/XXXXXXX",
  localeDefault: "es" as const,
};