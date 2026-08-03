"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
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
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: ReactWheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: ReactTouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: ReactTouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("scroll", handleScroll as EventListener);
    window.addEventListener(
      "touchstart",
      handleTouchStart as unknown as EventListener,
      { passive: false },
    );
    window.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener,
      { passive: false },
    );
    window.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener,
      );
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener(
        "touchstart",
        handleTouchStart as unknown as EventListener,
      );
      window.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener,
      );
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

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
    (isMobileState ? 320 : 700) +
    scrollProgress * (isMobileState ? 620 : 900);
  const mediaHeight =
    (isMobileState ? 480 : 420) +
    scrollProgress * (isMobileState ? 220 : 420);

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden transition-colors duration-700 ease-in-out"
    >
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
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
          </motion.div>

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
                  <div className="relative flex h-full w-full">
                    <div className="relative z-10 flex w-full flex-col justify-center px-7 py-8 sm:px-10 sm:py-10">
                      <motion.p
                        className="text-base leading-none font-bold text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
                      >
                        Hello, I&apos;m
                      </motion.p>

                      <motion.h2
                        className="mt-4 text-[40px] leading-[0.92] font-bold tracking-[-0.04em] text-white sm:text-[56px] lg:text-[64px]"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.5, ease: "easeOut" }}
                      >
                        Jessy
                      </motion.h2>
                      <motion.h2
                        className="bg-gradient-to-r from-[#ff8a00] to-[#ff5e00] bg-clip-text text-[40px] leading-[0.92] font-bold tracking-[-0.04em] text-transparent sm:text-[56px] lg:text-[64px]"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.26, duration: 0.5, ease: "easeOut" }}
                      >
                        Prananda
                      </motion.h2>

                      <motion.div
                        className="mt-7 h-px w-full bg-white"
                        initial={{ opacity: 0, scaleX: 0.4 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.34, duration: 0.45, ease: "easeOut" }}
                        style={{ transformOrigin: "left center" }}
                      />

                      <motion.p
                        className="mt-6 max-w-[280px] text-base leading-7 text-white/75 sm:max-w-[320px] sm:text-lg sm:leading-8"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                      >
                        Building digital experiences with clean code and modern
                        technologies.
                      </motion.p>
                    </div>
                  </div>
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
                <motion.div
                  className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
                  style={{
                    top: `calc(50% + min(${mediaHeight / 2}px, 42.5dvh) + 1.75rem)`,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: Math.max(1 - scrollProgress * 1.4, 0),
                    y: 0,
                  }}
                  transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
                >
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-[#f5f2eb]/90 uppercase sm:text-xs">
                    {scrollToExpand}
                  </p>
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#f5f2eb] backdrop-blur-sm"
                    animate={
                      scrollProgress < 0.08
                        ? { y: [0, 6, 0] }
                        : { y: 0 }
                    }
                    transition={
                      scrollProgress < 0.08
                        ? {
                            duration: 1.6,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                        : { duration: 0.2 }
                    }
                  >
                    <ArrowDown className="size-4" strokeWidth={2} />
                  </motion.span>
                </motion.div>
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
