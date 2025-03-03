"use client";

import { Analytics } from "@vercel/analytics/react";

export function AnalyticsWrapper() {
  return (
    <Analytics
      mode="auto"
      beforeSend={(event) => {
        // Only allow page views
        if (event.type !== "pageview") {
          return null;
        }

        // Return the event as is - Vercel Analytics will automatically
        // collect essential data like country, device, and browser info
        return event;
      }}
    />
  );
}
