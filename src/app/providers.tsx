"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";
import { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Note: Browser wallet extensions (MetaMask, Rabby, etc.) may throw 
    // "Cannot redefine property: ethereum" errors. This is harmless and 
    // can be safely ignored - it's a known conflict between wallet 
    // extensions and wagmi/RainbowKit, but doesn't affect functionality.
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
