import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type AdminPanelLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
