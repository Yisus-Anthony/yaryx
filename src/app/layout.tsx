import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export const metadata = {
  title: "Mi App Next.js",
  description: "App responsive con ES Modules y CSS Modules",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="layout">
        <Navbar />

        <main className="main">
          <div className="container">{children}</div>
        </main>

        <Footer />
      </body>
    </html>
  );
}
