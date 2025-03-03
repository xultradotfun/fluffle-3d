import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import { AnalyticsWrapper } from "@/components/analytics/AnalyticsWrapper";
import { DiscordAuthProvider } from "@/contexts/DiscordAuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluffle Tools",
  description: "Utilities for MegaETH explorers and Fluffle holders",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/favicon.ico", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Fluffle Tools",
    description: "Utilities for MegaETH explorers and Fluffle holders",
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
    description: "Utilities for MegaETH explorers and Fluffle holders",
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
          <DiscordAuthProvider>
            <div className="relative min-h-screen antialiased bg-background text-foreground">
              {children}
              <Footer />
            </div>
          </DiscordAuthProvider>
        </ThemeProvider>
        <AnalyticsWrapper />
        <Toaster
          richColors
          position="top-center"
          expand={true}
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(8px)",
            },
            className: "text-sm font-medium rounded-xl",
          }}
        />
      </body>
    </html>
  );
}
