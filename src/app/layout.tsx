import "./globals.css";

import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton/WhatsAppButton";
import Footer from "@/components/layout/Footer/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Tu Refaccionaria",
  description: "Encuentra refacciones nuevas y usadas para tu vehículo",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="layout">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="main">
              <div className="container">{children}</div>
            </main>
            <Footer />
            <WhatsAppButton notificationCount={1} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
