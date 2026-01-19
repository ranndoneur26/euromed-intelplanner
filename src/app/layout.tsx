import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { GravityProvider } from "@/context/GravityContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "@/components/AuthGate";
import LanguageSync from "@/components/LanguageSync";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Euromed IntelPlanner",
  description: "Advanced Market Intelligence & Strategic Planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
        <LanguageProvider>
          <LanguageSync />
          <AuthProvider>
            <GravityProvider>
              <AuthGate>
                {children}
              </AuthGate>
            </GravityProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

