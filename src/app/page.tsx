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
      <HeroSection />
    </main>
  );
}
