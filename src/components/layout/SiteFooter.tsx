import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { NewsletterSignup } from "@/components/conversion/NewsletterSignup";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { FOOTER_NAV_GROUPS, SOCIAL_LINKS } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-dark bg-ink text-bone">
      <div className="mx-auto w-full max-w-(--container-max) px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <Wordmark tone="dark" />
            <p className="max-w-sm text-body text-fog">
              Writing, podcasting, and building — one media brand for faith, freedom, and the
              entrepreneurial life.
            </p>
            <NewsletterSignup tone="dark" variant="compact" />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {FOOTER_NAV_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <span className="text-meta font-semibold uppercase tracking-[0.04em] text-fog">
                  {group.title}
                </span>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body text-bone transition-colors duration-200 hover:text-gold-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-5 border-t border-border-dark pt-12 text-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-h3 font-semibold text-bone">Follow Dogood Mavericko</h3>
            <p className="max-w-md text-body text-fog">
              Follow along for more on faith, freedom, entrepreneurship, online business, and
              lifestyle design.
            </p>
          </div>
          <SocialLinks tone="dark" />
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-border-dark pt-8 sm:flex-row sm:items-center">
          <span className="text-meta tracking-[0.02em] text-fog">
            © {year} Dogood Mavericko. All rights reserved.
          </span>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-meta font-medium tracking-[0.04em] text-fog uppercase transition-colors duration-200 hover:text-gold-light"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
