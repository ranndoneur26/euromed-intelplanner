import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/context/LanguageContext";
import { GravityProvider } from "@/context/GravityContext";
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
          <GravityProvider>
            <div style={{ display: "flex", minHeight: "100vh" }}>
              <Sidebar />
              <main style={{ flex: 1, marginLeft: "280px", display: "flex", flexDirection: "column" }}>
                {children}
              </main>
            </div>
          </GravityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
