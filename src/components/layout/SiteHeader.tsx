"use client";

import { useEffect, useState } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { CtaButton } from "@/components/ui/CtaButton";
import { Wordmark } from "@/components/layout/Wordmark";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { SearchModal } from "@/components/search/SearchModal";
import { NAV_ITEMS, PRIMARY_CTA } from "@/lib/constants";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,padding,box-shadow] duration-300 ${
          scrolled
            ? "border-border bg-paper/90 py-3 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-md"
            : "border-transparent bg-paper py-5"
        }`}
      >
        <div className="mx-auto flex w-full max-w-(--container-max) items-center justify-between px-6 md:px-10">
          <Wordmark />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <SearchTrigger onClick={() => setSearchOpen(true)} />

            <div className="hidden lg:block">
              <CtaButton href={PRIMARY_CTA.href} size="md">
                {PRIMARY_CTA.label}
              </CtaButton>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={`h-px w-6 bg-charcoal transition-transform duration-300 ${
                  menuOpen ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 bg-charcoal transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-px w-6 bg-charcoal transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav">
        <MobileNav
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpenSearch={() => {
            setMenuOpen(false);
            setSearchOpen(true);
          }}
        />
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
