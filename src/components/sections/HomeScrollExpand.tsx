"use client";

import { useEffect, type ReactNode } from "react";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

type HomeScrollExpandProps = {
  children: ReactNode;
};

export function HomeScrollExpand({ children }: HomeScrollExpandProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/videos/hero.mp4"
      posterSrc="/images/hero-poster.jpg"
      bgImageSrc="/videos/hero-bg.mp4"
      title="Jessy Prananda"
      date="Fullstack Developer"
      scrollToExpand="Scroll to explore"
      textBlend
    >
      {children}
    </ScrollExpandMedia>
  );
}
