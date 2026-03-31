import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TeamThemeProvider } from "@/components/team-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SeasonX — Verified Ticket Marketplace",
    template: "%s | SeasonX",
  },
  description:
    "Buy and sell season tickets from verified season ticket holders. 0% seller fees, 3% buyer fees. The most trusted ticket marketplace.",
  keywords: ["tickets", "season tickets", "verified", "NFL", "NBA", "MLB", "NHL", "resale"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SeasonX — Verified Ticket Marketplace",
    description:
      "Only verified season ticket holders can sell here. The most trusted resale marketplace.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SeasonX",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <TeamThemeProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </TeamThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
