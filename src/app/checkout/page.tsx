import { Suspense } from "react";
import CheckoutPageClient from "./CheckoutPageClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Cargando checkout…</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
