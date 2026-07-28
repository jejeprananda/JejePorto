import type { Metadata } from "next";

import { HeroSection } from "@/components/sections/HeroSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jessy Prananda — Fullstack Designer. Portfolio home and introduction.",
};

export default function HomePage() {
  return (
    <main>
      <noscript>
        <style>{`
          [data-reveal] {
            opacity: 1 !important;
            translate: 0 0 !important;
            scale: 1 1 !important;
            transition: none !important;
          }
        `}</style>
      </noscript>
      <HeroSection />
    </main>
  );
}
