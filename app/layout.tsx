import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

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
