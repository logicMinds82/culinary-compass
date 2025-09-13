import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { EB_Garamond, Raleway } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";

const ebGaramond = EB_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-eb-garamond" });
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-raleway" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ebGaramond.variable} ${raleway.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="w-full mx-auto">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
