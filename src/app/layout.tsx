import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluffle Tools - 3D Viewer, Analytics & PFP Generator",
  description:
    "Many utilities for Fluffle NFT holders. View your NFTs in 3D, analyze rarity, generate unique profile pictures, and more!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
