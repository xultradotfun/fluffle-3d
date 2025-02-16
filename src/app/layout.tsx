import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluffle Tools",
  description:
    "Utilities for MegaETH Fluffle holders. View your NFTs in 3D, analyze rarity, generate unique profile pictures, and more!",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/favicon.ico", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Fluffle Tools",
    description:
      "Utilities for MegaETH Fluffle holders. View your NFTs in 3D, analyze rarity, generate unique profile pictures, and more!",
    images: [
      {
        url: "/socialpreview.jpg",
        width: 1200,
        height: 630,
        alt: "Fluffle Tools Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluffle Tools",
    description:
      "Utilities for MegaETH Fluffle holders. View your NFTs in 3D, analyze rarity, generate unique profile pictures, and more!",
    images: ["/socialpreview.jpg"],
    creator: "@0x_ultra",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider>
          <div className="relative min-h-screen antialiased bg-background text-foreground">
            <ThemeToggle />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
