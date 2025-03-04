"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url =
        searchParams.size > 0
          ? `${pathname}?${searchParams.toString()}`
          : pathname;

      // Send pageview with their full URL
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);
}
