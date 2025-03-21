import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore MegaETH | Fluffle Tools",
  description:
    "Step-by-step guides to help you explore and interact with projects on the MegaETH testnet.",
  openGraph: {
    title: "Explore MegaETH | Fluffle Tools",
    description:
      "Step-by-step guides to help you explore and interact with projects on the MegaETH testnet.",
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
    title: "Explore MegaETH | Fluffle Tools",
    description:
      "Step-by-step guides to help you explore and interact with projects on the MegaETH testnet.",
    images: ["/socialpreview.jpg"],
    creator: "@0x_ultra",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
