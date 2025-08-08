"use client";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Editorial Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-foreground">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo/Brand */}
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 bg-foreground"></div>
              <span className="text-lg font-black uppercase tracking-wider">
                Fluffle Tools
              </span>
            </a>

            {/* Right side actions */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <a 
                  href="https://opensea.io/collection/megaeth-nft-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold uppercase tracking-wide hover:opacity-70 transition-opacity"
                >
                  Collection
                </a>
                <a 
                  href="https://x.com/intent/follow?screen_name=0x_ultra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold uppercase tracking-wide hover:opacity-70 transition-opacity"
                >
                  Twitter
                </a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Main Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8">
              {/* Main headline */}
              <div className="mb-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight leading-[0.85] mb-4">
                  FLUFFLE
                </h1>
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight leading-[0.85]">
                  TOOLS
                </h1>
              </div>

              {/* Description */}
              <div className="mb-12">
                <div className="w-16 h-1 bg-foreground mb-6"></div>
                <p className="text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                  Utilities for{" "}
                  <span className="font-black">MegaETH</span>{" "}
                  explorers and{" "}
                  <span className="font-black">Fluffle</span>{" "}
                  holders
                </p>
              </div>
            </div>

            {/* Right Content - Stats and CTA */}
            <div className="lg:col-span-4 space-y-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-4xl lg:text-5xl font-black tracking-tight">
                    5,000
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wide opacity-70">
                    Rabbits
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl lg:text-5xl font-black tracking-tight">
                    16
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wide opacity-70">
                    Tribes
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <div className="w-16 h-1 bg-foreground"></div>
                <a 
                  href="https://x.com/intent/follow?screen_name=0x_ultra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-foreground text-background px-8 py-4 font-black uppercase tracking-wide text-sm hover:bg-background hover:text-foreground border-2 border-foreground transition-all duration-200"
                >
                  Follow 0x_ultra
                </a>
                <p className="text-sm opacity-60 font-medium">
                  Stay updated with the latest tools and features
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
