"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Mail, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

type SocialLink = {
  label: string;
  href: string;
  icon: (props: { className?: string }) => ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/jejeprananda/",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jessy-prananda-22171bb5/",
    icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jetechtalk",
    icon: InstagramIcon,
  },
  {
    label: "Email",
    href: "mailto:jessy.prananda@gmail.com",
    icon: ({ className }) => (
      <Mail aria-hidden="true" className={className} strokeWidth={2} />
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/628987847242",
    icon: ({ className }) => (
      <MessageCircle aria-hidden="true" className={className} strokeWidth={2} />
    ),
  },
];

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate min-h-dvh w-full overflow-hidden bg-[#f5f6f7]"
    >
      <Reveal
        trigger="mount"
        direction="right"
        distance="wide"
        duration={800}
        className="absolute inset-0 -z-30"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/bg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              object-[68%_center]
              sm:object-[64%_center]
              md:object-[60%_center]
              lg:object-center
            "
          />
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              bg-gradient-to-r
              from-white
              via-white/90
              to-white/10
              sm:via-white/75
              lg:from-white/95
              lg:via-white/45
              lg:to-transparent
            "
          />
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              bg-gradient-to-b
              from-white/75
              via-white/20
              to-white/10
              lg:from-white/40
              lg:via-transparent
            "
          />
        </div>
      </Reveal>

      <div
        className="
          flex min-h-dvh w-full
          items-center
          pl-5 pr-5 pb-14 pt-28
          sm:pl-4 sm:pr-8 sm:pb-16 sm:pt-32
          lg:pb-20 lg:pt-36
        "
      >
        <div className="w-full max-w-[760px]">
          <div className="flex gap-5 sm:gap-8">
            <Reveal
              trigger="mount"
              direction="scaleY"
              delay={150}
              duration={700}
              className="
                relative hidden w-px shrink-0 self-stretch overflow-hidden
                bg-slate-900/80
                sm:block
              "
            >
              <div aria-hidden="true" className="relative h-full w-full">
                <span className="absolute bottom-0 left-0 h-20 w-px bg-orange-500" />
              </div>
            </Reveal>

            <div className="min-w-0">
              <Reveal trigger="mount" direction="left" delay={200} duration={700}>
                <p
                  className="
                    text-3xl font-light leading-none tracking-[-0.035em]
                    text-slate-800
                    sm:text-4xl
                    lg:text-[2.65rem]
                  "
                >
                  Hi, I&apos;m
                </p>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={280} duration={700}>
                <h1
                  id="hero-title"
                  className="
                    mt-4 max-w-[760px]
                    text-[clamp(3.3rem,7.2vw,6rem)]
                    font-semibold leading-[0.88]
                    tracking-[-0.065em]
                    text-slate-950
                  "
                >
                  Jessy{" "}
                  <span className="text-orange-500">Prananda</span>
                </h1>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={360} duration={700}>
                <p
                  className="
                    mt-5 text-2xl font-semibold
                    tracking-[-0.035em]
                    text-slate-950
                    sm:text-3xl
                    lg:text-[2.35rem]
                  "
                >
                  Fullstack Developer
                </p>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={440} duration={700}>
                <p
                  lang="ja"
                  className="
                    mt-9 max-w-xl
                    text-sm font-medium leading-7
                    tracking-[0.08em]
                    text-slate-600
                    sm:text-base sm:leading-8
                    lg:text-lg
                  "
                >
                  デザインとコードで、アイデアをカタチにする。
                </p>
              </Reveal>

              <Reveal trigger="mount" direction="left" delay={520} duration={700}>
                <p
                  className="
                    mt-3 max-w-xl
                    text-sm leading-7 text-slate-600
                    sm:text-base
                  "
                >
                  I design thoughtful interfaces and build them into fast,
                  functional, and scalable digital products.
                </p>
              </Reveal>

              <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
                <Reveal trigger="mount" direction="left" delay={600} duration={700}>
                  <Link
                    href="/works"
                    className="
                      inline-flex min-h-12 items-center justify-center
                      rounded-sm bg-slate-950 px-6
                      text-sm font-medium text-white
                      transition duration-300
                      hover:-translate-y-0.5 hover:bg-slate-800
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-orange-500
                      focus-visible:ring-offset-2
                    "
                  >
                    View My Work
                  </Link>
                </Reveal>

                <Reveal trigger="mount" direction="left" delay={680} duration={700}>
                  <Link
                    href="/contact"
                    className="
                      inline-flex min-h-12 items-center justify-center
                      rounded-sm border border-slate-900/20
                      bg-white/45 px-6
                      text-sm font-medium text-slate-900
                      backdrop-blur-sm
                      transition duration-300
                      hover:-translate-y-0.5
                      hover:border-orange-500
                      hover:bg-white/80
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-orange-500
                      focus-visible:ring-offset-2
                    "
                  >
                    Contact Me
                  </Link>
                </Reveal>
              </div>

              <nav aria-label="Social media" className="mt-8 sm:mt-10">
                <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {socialLinks.map((socialLink, index) => {
                    const Icon = socialLink.icon;
                    const isExternal = socialLink.href.startsWith("http");

                    return (
                      <li key={socialLink.label}>
                        <Reveal
                          trigger="mount"
                          direction="left"
                          delay={760 + index * 70}
                          duration={700}
                        >
                          <Link
                            href={socialLink.href}
                            aria-label={socialLink.label}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            className="
                              inline-flex size-11 items-center justify-center
                              rounded-full text-slate-700
                              transition duration-300
                              hover:-translate-y-1
                              hover:bg-white/60
                              hover:text-orange-500
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-orange-500
                            "
                          >
                            <Icon className="size-5" />
                          </Link>
                        </Reveal>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
