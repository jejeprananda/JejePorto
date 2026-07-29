"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Menu, X } from "lucide-react";

const navigationItems = [
  { label: "About", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 16);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isMenuOpen
          ? "border-b border-slate-900/5 bg-white shadow-sm lg:border-0 lg:bg-transparent lg:shadow-none"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <nav
          aria-label="Main navigation"
          className={[
            "flex h-20 w-full items-center justify-between transition-all duration-300 lg:h-16",
            // Desktop floating glass shell
            "lg:mt-5 lg:rounded-full lg:border lg:border-white/80 lg:px-8 xl:px-10",
            "lg:bg-white/10 lg:backdrop-blur-md lg:shadow-[0_8px_32px_rgb(0_0_0_/_0.12)]",
            isScrolled && "lg:bg-white/15",
          ].join(" ")}
        >
          <Link
            href="/"
            aria-label="Go to homepage"
            onClick={closeMenu}
            className={[
              "relative z-50 text-2xl font-bold tracking-[-0.06em] transition-opacity hover:opacity-70 sm:text-3xl",
              isMenuOpen ? "text-slate-900" : "text-slate-900 lg:text-white",
            ].join(" ")}
          >
            JP<span className="text-orange-500">.</span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex xl:gap-12">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="
                    relative py-2 text-sm font-medium text-white/90
                    transition-colors duration-300
                    after:absolute after:inset-x-0 after:bottom-0 after:h-px
                    after:origin-right after:scale-x-0 after:bg-orange-500
                    after:transition-transform after:duration-300
                    hover:text-white
                    hover:after:origin-left hover:after:scale-x-100
                    xl:text-base
                  "
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-slate-900/10 bg-white/60 text-slate-900 backdrop-blur-md transition-colors hover:bg-white lg:hidden"
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>

      <div
        id="mobile-navigation"
        className={[
          "fixed inset-0 z-40 bg-white px-5 pb-8 pt-28 transition-all duration-300 lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        ].join(" ")}
      >
        <ul>
          {navigationItems.map((item, index) => (
            <li key={item.href} className="border-b border-slate-900/10">
              <Link
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-20 items-center justify-between py-5 text-3xl font-medium tracking-tight text-slate-900"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-orange-500">
                  0{index + 1}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="absolute bottom-8 left-5 text-xs uppercase tracking-[0.24em] text-slate-500">
          Fullstack Designer
        </p>
      </div>
    </header>
  );
}
