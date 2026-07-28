"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type RevealDirection = "left" | "right" | "up" | "scaleY";
export type RevealTrigger = "mount" | "scroll";

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  trigger?: RevealTrigger;
  distance?: "default" | "wide";
};

const HIDDEN: Record<
  RevealDirection,
  Record<"default" | "wide", string>
> = {
  left: {
    default: "-translate-x-6 opacity-0",
    wide: "-translate-x-12 opacity-0",
  },
  right: {
    default: "translate-x-6 opacity-0",
    wide: "translate-x-12 opacity-0",
  },
  up: {
    default: "translate-y-6 opacity-0",
    wide: "translate-y-12 opacity-0",
  },
  scaleY: {
    default: "origin-top scale-y-0",
    wide: "origin-top scale-y-0",
  },
};

const VISIBLE: Record<RevealDirection, string> = {
  left: "translate-x-0 opacity-100",
  right: "translate-x-0 opacity-100",
  up: "translate-y-0 opacity-100",
  scaleY: "origin-top scale-y-100",
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 700,
  trigger = "scroll",
  distance = "default",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    if (trigger === "mount") {
      const timer = window.setTimeout(() => setVisible(true), delay);
      return () => window.clearTimeout(timer);
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (delay > 0) {
            window.setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, trigger]);

  const style: CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: trigger === "scroll" && visible ? "0ms" : undefined,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={[
        "transition-[opacity,transform] ease-out",
        "motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-y-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? VISIBLE[direction] : HIDDEN[direction][distance],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
