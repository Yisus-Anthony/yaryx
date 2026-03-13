import "./globals.css";

import { CartProvider } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton/WhatsAppButton";
import Footer from "@/components/layout/Footer/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata = {
  title: "Tu Refaccionaria",
  description: "Encuentra refacciones nuevas y usadas para tu vehículo",
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
