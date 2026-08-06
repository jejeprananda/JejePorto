"use client";

import {
  memo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { ContributionGraph } from "@/components/ui/contribution-graph";
import type { GitHubStats } from "@/services/github/getGitHubStats";

type HeroCardContentProps = {
  github?: GitHubStats;
  monthsToShow: number;
};

const HeroCardContent = memo(function HeroCardContent({
  github,
  monthsToShow,
}: HeroCardContentProps) {
  return (
    <div className="relative flex h-full w-full">
      <div
        className="
          relative z-10 flex h-full w-full flex-col items-center justify-center
          gap-8 px-6 py-7
          sm:gap-10 sm:px-9 sm:py-9
          md:flex-row md:items-center md:justify-between
        "
      >
        <div className="flex shrink-0 flex-col items-center text-center md:items-start md:text-left">
          <motion.h2
            className="text-[36px] leading-[0.92] font-bold tracking-[-0.04em] text-white sm:text-[48px] lg:text-[56px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: "easeOut" }}
          >
            Jessy
          </motion.h2>
          <motion.h2
            className="bg-gradient-to-r from-[#ff8a00] to-[#ff5e00] bg-clip-text text-[36px] leading-[0.92] font-bold tracking-[-0.04em] text-transparent sm:text-[48px] lg:text-[56px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5, ease: "easeOut" }}
          >
            Prananda
          </motion.h2>

          <motion.p
            className="mt-4 text-sm font-semibold tracking-[0.18em] text-white/75 uppercase sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
          >
            Fullstack Developer
          </motion.p>
        </div>

        {github && github.contributions.length > 0 ? (
          <motion.div
            className="
              mx-auto min-w-0 w-full max-w-[min(100%,360px)]
              rounded-2xl border border-white/15
              bg-[#0d1117]/92 px-3 py-3
              sm:px-4 sm:py-4
              md:mx-0 md:max-w-[320px] lg:max-w-[360px]
            "
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: "easeOut" }}
          >
            <ContributionGraph
              contributions={github.contributions}
              profileUrl={github.profileUrl}
              monthsToShow={monthsToShow}
            />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
});

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  github?: GitHubStats;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  github,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaVideoRef = useRef<HTMLVideoElement | null>(null);
  const scrollProgressRef = useRef(0);
  const mediaFullyExpandedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);

  const contributionMonths = isMobileState ? 3 : 4;

  const commitScrollProgress = (nextProgress: number) => {
    scrollProgressRef.current = nextProgress;

    if (scrollRafRef.current !== null) {
      return;
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const progress = scrollProgressRef.current;

      setScrollProgress(progress);

      if (progress >= 1) {
        mediaFullyExpandedRef.current = true;
        setShowContent(true);
        return;
      }

      if (progress < 0.75) {
        setShowContent(false);
      }
    });
  };

  useEffect(() => {
    scrollProgressRef.current = 0;
    mediaFullyExpandedRef.current = false;
    touchStartYRef.current = 0;
    setScrollProgress(0);
    setShowContent(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (
        mediaFullyExpandedRef.current &&
        event.deltaY < 0 &&
        window.scrollY <= 5
      ) {
        mediaFullyExpandedRef.current = false;
        event.preventDefault();
        return;
      }

      if (mediaFullyExpandedRef.current) {
        return;
      }

      event.preventDefault();
      const scrollDelta = event.deltaY * 0.0009;
      const newProgress = Math.min(
        Math.max(scrollProgressRef.current + scrollDelta, 0),
        1,
      );
      commitScrollProgress(newProgress);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartYRef.current) {
        return;
      }

      const touchY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - touchY;

      if (
        mediaFullyExpandedRef.current &&
        deltaY < -20 &&
        window.scrollY <= 5
      ) {
        mediaFullyExpandedRef.current = false;
        event.preventDefault();
        return;
      }

      if (mediaFullyExpandedRef.current) {
        return;
      }

      event.preventDefault();
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
      const scrollDelta = deltaY * scrollFactor;
      const newProgress = Math.min(
        Math.max(scrollProgressRef.current + scrollDelta, 0),
        1,
      );
      commitScrollProgress(newProgress);
      touchStartYRef.current = touchY;
    };

    const handleTouchEnd = (): void => {
      touchStartYRef.current = 0;
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpandedRef.current) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const video = mediaVideoRef.current;
    if (!video || mediaType !== "video" || mediaSrc.includes("youtube.com")) {
      return;
    }

    if (scrollProgress > 0.02) {
      void video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [scrollProgress, mediaType, mediaSrc]);

  const mediaWidth =
    (isMobileState ? 320 : 860) +
    scrollProgress * (isMobileState ? 620 : 640);
  const mediaHeight =
    (isMobileState ? 520 : 440) +
    scrollProgress * (isMobileState ? 200 : 400);

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden transition-colors duration-700 ease-in-out"
    >
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          <div
            className="absolute inset-0 z-0 h-full"
            style={{ opacity: 1 - scrollProgress }}
          >
            {bgImageSrc.endsWith(".mp4") ? (
              <video
                src={bgImageSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                className="h-screen w-screen object-cover object-center"
              />
            ) : (
              <Image
                src={bgImageSrc}
                alt=""
                width={1920}
                height={1080}
                className="h-screen w-screen"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative z-10 container mx-auto flex flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="premium-hero-card absolute top-1/2 left-1/2 z-0 overflow-hidden transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  transform: "translate(-50%, -50%)",
                  borderRadius: 28,
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.25), 0 0 80px rgba(255,138,0,0.12)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,138,0,0.14),transparent_55%)]"
                />

                <div
                  className="absolute inset-0 z-10"
                  style={{
                    opacity: Math.max(1 - scrollProgress * 1.2, 0),
                    pointerEvents: scrollProgress > 0.5 ? "none" : "auto",
                  }}
                >
                  <HeroCardContent
                    github={github}
                    monthsToShow={contributionMonths}
                  />
                </div>

                {mediaType === "video" ? (
                  mediaSrc.includes("youtube.com") ? (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ opacity: scrollProgress }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes("embed")
                            ? mediaSrc +
                              (mediaSrc.includes("?") ? "&" : "?") +
                              "autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
                            : mediaSrc.replace("watch?v=", "embed/") +
                              "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=" +
                              mediaSrc.split("v=")[1]
                        }
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute inset-0">
                      <video
                        ref={mediaVideoRef}
                        src={mediaSrc}
                        poster={posterSrc}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="h-full w-full object-cover transition-opacity duration-150"
                        style={{ opacity: scrollProgress }}
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                    </div>
                  )
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ opacity: scrollProgress }}
                  >
                    <Image
                      src={mediaSrc}
                      alt={title || "Media content"}
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {scrollToExpand && (
                <div
                  className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
                  style={{
                    top: `calc(50% + min(${mediaHeight / 2}px, 42.5dvh) + 1.75rem)`,
                    opacity: Math.max(1 - scrollProgress * 1.4, 0),
                  }}
                >
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-[#f5f2eb]/90 uppercase sm:text-xs">
                    {scrollToExpand}
                  </p>
                  <span
                    aria-hidden="true"
                    className={`
                      inline-flex size-8 items-center justify-center rounded-full
                      border border-white/25 bg-white/10 text-[#f5f2eb] backdrop-blur-sm
                      ${scrollProgress < 0.08 ? "motion-safe:animate-bounce" : ""}
                    `}
                  >
                    <ArrowDown className="size-4" strokeWidth={2} />
                  </span>
                </div>
              )}
            </div>

            <motion.section
              className="flex w-full flex-col px-0 py-0 md:px-0 lg:py-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
