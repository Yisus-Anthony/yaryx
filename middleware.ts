import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (!pathname.startsWith("/admin")) return NextResponse.next();
    if (pathname === "/admin/login") return NextResponse.next();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !(token as any).isAdmin) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};