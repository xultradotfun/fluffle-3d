"use client";

import Script from "next/script";

// Declare global gtag function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PNV3G0QQ5H"
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Error loading Google Analytics:", e);
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Error loading Google Analytics config:", e);
        }}
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PNV3G0QQ5H', {
            page_path: window.location.pathname,
            transport_url: 'https://www.googletagmanager.com',
            first_party_collection: true
          });
        `}
      </Script>
    </>
  );
}
