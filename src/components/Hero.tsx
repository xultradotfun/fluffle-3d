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
      {/* Spacer for fixed header */}
      <div className={`transition-all duration-300 ${isScrolled ? "h-16" : "h-32"}`} />

      {/* Fixed Editorial Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur border-b border-border" 
            : "bg-background"
        }`}
      >
        <div className="container mx-auto px-8 py-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "py-2" : "py-4"
          }`}>
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-foreground"></div>
              <a href="/" className="hover:opacity-80 transition-opacity">
                <span className={`font-black uppercase tracking-wider transition-all duration-300 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}>
                  Fluffle Tools
                </span>
              </a>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <a 
                  href="https://opensea.io/collection/megaeth-nft-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium uppercase tracking-wide text-sm hover:opacity-70 transition-opacity"
                >
                  Collection
                </a>
                <a 
                  href="https://x.com/intent/follow?screen_name=0x_ultra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium uppercase tracking-wide text-sm hover:opacity-70 transition-opacity"
                >
                  Twitter
                </a>
              </nav>
              <ThemeToggle />
            </div>
          </div>

          {/* Editorial Line */}
          {!isScrolled && (
            <div className="editorial-line w-full mt-4"></div>
          )}
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-start">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl">
            {/* Main headline */}
            <h1 className="text-editorial-large mb-8 animate-fadeIn">
              FLUFFLE<br />
              TOOLS
            </h1>

            {/* Description */}
            <div className="editorial-section mb-12">
              <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
                Utilities for{" "}
                <span className="font-black uppercase">MegaETH</span>{" "}
                explorers and{" "}
                <span className="font-black uppercase">Fluffle</span>{" "}
                holders
              </p>
            </div>

            {/* Stats and Follow Button */}
            <div className="flex items-center space-x-12 mb-16">
              <div className="flex items-center space-x-12 text-sm uppercase tracking-wider font-medium">
                <div>
                  <span className="block text-2xl font-black">5,000</span>
                  <span className="text-muted-foreground">Rabbits</span>
                </div>
                <div>
                  <span className="block text-2xl font-black">16</span>
                  <span className="text-muted-foreground">Tribes</span>
                </div>
              </div>
              <a 
                href="https://x.com/intent/follow?screen_name=0x_ultra"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutalist whitespace-nowrap"
              >
                Follow 0x_ultra
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
