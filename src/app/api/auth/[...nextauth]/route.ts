import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();

const handler = NextAuth({
    providers: [
        Credentials({
            name: "Admin",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "tu@correo.com" },
            },
            async authorize(credentials) {
                const email = (credentials?.email || "").toLowerCase().trim();
                if (!email) return null;
                if (!adminEmail) return null;

                // allowlist: solo este correo entra
                if (email !== adminEmail) return null;

                return { id: email, email, name: "Admin" };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.email) token.email = user.email;
            token.isAdmin = token.email === adminEmail;
            return token;
        },
        async session({ session, token }) {
            (session as any).isAdmin = token.isAdmin;
            return session;
        },
    },
});

export { handler as GET, handler as POST };