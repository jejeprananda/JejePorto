"use client";

import { useEffect, type ReactNode } from "react";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import type { GitHubStats } from "@/services/github/getGitHubStats";

type HomeScrollExpandProps = {
  children: ReactNode;
  github: GitHubStats;
};

export function HomeScrollExpand({ children, github }: HomeScrollExpandProps) {
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
      github={github}
    >
      {children}
    </ScrollExpandMedia>
  );
}
