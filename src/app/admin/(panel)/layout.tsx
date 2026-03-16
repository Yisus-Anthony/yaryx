import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      isActive: true,
      sessionVersion: true,
      name: true,
      email: true,
    },
  });

  const role = String(dbUser?.role ?? "");
  const tokenSessionVersion = Number(session.user.sessionVersion ?? 1);
  const dbSessionVersion = Number(dbUser?.sessionVersion ?? 0);

  if (
    !dbUser ||
    !dbUser.isActive ||
    role !== "ADMIN" ||
    tokenSessionVersion !== dbSessionVersion
  ) {
    redirect("/admin/login");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  async function handleSignOutAllDevices() {
    "use server";

    const currentSession = await auth();

    if (!currentSession?.user?.id) {
      await signOut({ redirectTo: "/admin/login" });
      return;
    }

    await prisma.user.update({
      where: { id: currentSession.user.id },
      data: {
        sessionVersion: {
          increment: 1,
        },
      },
    });

    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <section>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          padding: "16px 24px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/admin/products">Admin</Link>
          <span style={{ color: "#6b7280", fontSize: 14 }}>
            {dbUser.name || dbUser.email}
          </span>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <form action={handleSignOutAllDevices}>
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#000",
                cursor: "pointer",
              }}
            >
              Cerrar sesión en todos los dispositivos
            </button>
          </form>

          <form action={handleSignOut}>
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#000",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <div>{children}</div>
    </section>
  );
}
