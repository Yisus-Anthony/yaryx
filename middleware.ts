import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED = ["es", "en"] as const;

function isBot(ua: string) {
  return /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduckbot/i.test(ua);
}

function pickLocale(acceptLanguage: string | null) {
  const raw = (acceptLanguage || "").toLowerCase();
  if (raw.includes("en")) return "en";
  return "es";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ya en /es o /en
  if (SUPPORTED.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  // cookie preferencia
  const cookieLocale = req.cookies.get("yaryx_locale")?.value;
  if (cookieLocale === "es" || cookieLocale === "en") {
    const url = req.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // no redirigir bots
  const ua = req.headers.get("user-agent") || "";
  if (isBot(ua)) return NextResponse.next();

  // Accept-Language
  const locale = pickLocale(req.headers.get("accept-language"));
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|assets).*)"],
};