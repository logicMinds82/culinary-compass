import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Culinary Compass - Community Recipe Sharing",
  description: "Share your favorite recipes and discover new dishes from home cooks around the world. Join our community-driven recipe platform.",
  keywords: ["recipes", "cooking", "community", "food", "share recipes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="w-full mx-auto min-h-[calc(100vh-73px)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
