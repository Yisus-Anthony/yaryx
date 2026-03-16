import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Correo",
                    type: "email",
                },
                password: {
                    label: "Contraseña",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const email = String(credentials?.email ?? "").trim().toLowerCase();
                const password = String(credentials?.password ?? "");

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        isActive: true,
                        passwordHash: true,
                        sessionVersion: true,
                    },
                });

                if (!user || !user.isActive) return null;

                const validPassword = await bcrypt.compare(password, user.passwordHash);
                if (!validPassword) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: String(user.role),
                    sessionVersion: user.sessionVersion,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = String(user.id);
                token.role = String((user as { role?: string }).role ?? "");
                token.sessionVersion = Number(
                    (user as { sessionVersion?: number }).sessionVersion ?? 1
                );
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.sub ?? "");
                session.user.role = String(token.role ?? "");
                session.user.sessionVersion = Number(token.sessionVersion ?? 1);
            }
            return session;
        },
        async authorized({ auth, request }) {
            const pathname = request.nextUrl.pathname;

            if (pathname.startsWith("/admin/login")) return true;

            if (pathname.startsWith("/admin")) {
                return !!auth?.user && auth.user.role === "ADMIN";
            }

            return true;
        },
    },
});