import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const { pathname } = nextUrl;

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/products", nextUrl));
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};