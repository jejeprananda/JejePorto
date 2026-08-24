"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type HeroVideoChapterProps = {
  children: ReactNode;
};

export function HeroVideoChapter({ children }: HeroVideoChapterProps) {
  const chapterRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);

    function onChange() {
      setReduceMotion(media.matches);
    }

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    function onScroll() {
      const el = chapterRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      setProgress(total > 0 ? scrolled / total : 1);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const dim = 0.18 + progress * 0.5;
  const translate = progress * 28;
  const overlayOpacity = Math.max(1 - progress * 1.35, 0);
  const chapterHeight = reduceMotion ? "h-svh" : "h-[180vh]";

  return (
    <div>
      <div
        ref={chapterRef}
        className={`relative motion-reduce:h-svh ${chapterHeight}`}
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-ink">
          <video
            src="/videos/hero.mp4"
            poster="/images/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-center motion-reduce:translate-y-0"
            style={
              reduceMotion
                ? undefined
                : { transform: `translate3d(0, ${-translate}px, 0)` }
            }
          />
          {!reduceMotion ? (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ink motion-reduce:opacity-0"
                style={{ opacity: dim }}
              />
              <div
                className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12 motion-reduce:hidden sm:px-8 lg:px-12"
                style={{ opacity: overlayOpacity }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80">
                  Fullstack Developer
                </p>
                <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white [overflow-wrap:anywhere] sm:text-6xl">
                  Jessy Prananda
                </h1>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-white/70">
                  Scroll
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}
