"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";

const navigationItems = [
  { label: "About", href: "/" },
  { label: "Works", href: "/#projects" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverVideo, setIsOverVideo] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setIsOverVideo(false);
      return;
    }

    function handleScroll() {
      setIsOverVideo(window.scrollY < window.innerHeight * 0.85);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const lightOnDark = isOverVideo && !isMenuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Go to homepage"
          onClick={closeMenu}
          className={[
            "relative z-50 text-xl font-semibold tracking-[-0.06em]",
            lightOnDark ? "text-white" : "text-ink",
          ].join(" ")}
        >
          JP<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={[
                    "text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    lightOnDark
                      ? "text-white/90 hover:text-white focus-visible:ring-offset-transparent"
                      : "text-ink hover:text-accent focus-visible:ring-offset-paper",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((value) => !value)}
          className={[
            "relative z-50 inline-flex size-11 items-center justify-center border lg:hidden",
            lightOnDark
              ? "border-white/30 text-white"
              : "border-rule bg-paper text-ink",
          ].join(" ")}
        >
          {isMenuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="mobile-navigation"
          className={[
            "fixed inset-0 z-40 bg-paper px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] transition-all duration-300 lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        ].join(" ")}
      >
        <ul>
          {navigationItems.map((item) => (
            <li key={item.label} className="border-b border-rule">
              <Link
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-14 items-center text-xl font-medium tracking-tight text-ink sm:min-h-16 sm:text-2xl"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
