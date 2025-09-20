import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { EB_Garamond, Raleway } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createClient } from "./utils/supabase/server";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-eb-garamond",
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-raleway",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  let profile = null;
  
  if (user) {
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    } else {
      profile = profileData;
    }
  }

  return (
    <html lang="en">
      <body
        className={`${ebGaramond.variable} ${raleway.variable} antialiased`}
      >
        <AuthProvider initialUser={user} initialProfile={profile}>
          <Header />
          <main className="w-full mx-auto">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
