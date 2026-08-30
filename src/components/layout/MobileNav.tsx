"use client";

import { useEffect } from "react";
import { NavLink } from "@/components/ui/NavLink";
import { CtaButton } from "@/components/ui/CtaButton";
import { NAV_ITEMS, PRIMARY_CTA, SOCIAL_LINKS } from "@/lib/constants";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 bg-ink transition-opacity duration-300 lg:hidden ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div
        className={`flex h-full flex-col justify-between px-6 pt-28 pb-10 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <nav className="flex flex-col gap-7">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.href}
              className="border-b border-border-dark pb-7"
              style={{ transitionDelay: isOpen ? `${i * 40}ms` : "0ms" }}
            >
              <NavLink
                href={item.href}
                tone="dark"
                onClick={onClose}
                className="text-h3! font-semibold!"
              >
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-8">
          <CtaButton href={PRIMARY_CTA.href} size="lg" onClick={onClose} className="w-full">
            {PRIMARY_CTA.label}
          </CtaButton>

          <div className="flex items-center justify-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-meta font-medium tracking-[0.04em] text-fog uppercase transition-colors hover:text-gold-light"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
