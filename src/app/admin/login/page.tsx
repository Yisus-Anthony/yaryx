import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams?.callbackUrl || "/admin/products";

  return <AdminLoginClient callbackUrl={callbackUrl} />;
}
