"use client";

import { colors } from "@/lib/colors";
import { getClipPath } from "@/lib/sizes";
import { BorderedBox } from "@/components/ui/BorderedBox";
import Hero from "@/components/layout/Hero";
import { Home, ArrowLeft, Rabbit } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.background }}
    >
      <Hero />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {/* Giant 404 */}
          <div className="relative mb-8">
            {/* Shadow layer */}
            <div
              className="absolute inset-0 translate-x-2 translate-y-2"
              style={{ clipPath: getClipPath("3xl") }}
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: colors.pink }}
              />
            </div>

            {/* Main 404 box */}
            <BorderedBox
              cornerSize="3xl"
              borderColor="dark"
              bgColor="dark"
              className="relative p-8 sm:p-12 text-center"
            >
              {/* Decorative rabbit */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 flex items-center justify-center"
                  style={{
                    backgroundColor: colors.pink,
                    clipPath: getClipPath("md"),
                  }}
                >
                  <Rabbit
                    className="w-9 h-9"
                    strokeWidth={2.5}
                    style={{ color: colors.foreground }}
                  />
                </div>
              </div>

              {/* 404 number */}
              <div
                className="text-[7rem] sm:text-[9rem] font-black leading-none tracking-tighter select-none"
                style={{ color: colors.background }}
              >
                4
                <span style={{ color: colors.pink }}>0</span>
                4
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div
                  className="flex-1 h-[3px]"
                  style={{ backgroundColor: colors.border }}
                />
                <div
                  className="w-2 h-2"
                  style={{ backgroundColor: colors.pink }}
                />
                <div
                  className="flex-1 h-[3px]"
                  style={{ backgroundColor: colors.border }}
                />
              </div>

              {/* Message */}
              <h1
                className="text-lg sm:text-xl font-black uppercase tracking-wide mb-2"
                style={{ color: colors.background }}
              >
                Page Not Found
              </h1>
              <p
                className="text-xs sm:text-sm font-bold uppercase"
                style={{ color: colors.mutedLight }}
              >
                This fluffle hopped into the void
              </p>
            </BorderedBox>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1 group">
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border-3 border-foreground font-black uppercase text-sm transition-colors hover:bg-pink hover:border-foreground"
                style={{
                  backgroundColor: colors.pink,
                  color: colors.foreground,
                  clipPath: getClipPath("md"),
                }}
              >
                <Home className="w-4 h-4" strokeWidth={3} />
                Go Home
              </button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border-3 border-foreground font-black uppercase text-sm transition-colors hover:bg-foreground hover:text-background"
              style={{
                backgroundColor: colors.background,
                color: colors.foreground,
                clipPath: getClipPath("md"),
              }}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={3} />
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
