"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/public/Logo";
import { SocialIcons } from "@/components/public/SocialIcons";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-paper">
      <nav className="mx-auto flex h-[136px] max-w-[1440px] items-center justify-between px-6 lg:px-16">
        <div className="flex shrink-0 items-center gap-2">
          <Logo priority className="h-28 w-auto" />
          <span className="hidden whitespace-nowrap text-xl font-semibold uppercase tracking-[0.15em] text-teal lg:inline">
            Talking Spaces
          </span>
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors hover:text-teal"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/services"
            className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors hover:text-teal"
          >
            Our Services
          </Link>

          <Link
            href="/before-after"
            className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors hover:text-teal"
          >
            Before &amp; After
          </Link>
          <Link
            href="/contact"
            className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors hover:text-teal"
          >
            Contact
          </Link>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <SocialIcons />
          <ConsultationDialog className="bg-teal-dark px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-colors hover:bg-teal" />
        </div>

        <button
          type="button"
          className="lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-charcoal/10 bg-paper px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold uppercase tracking-wide text-charcoal"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold uppercase tracking-wide text-charcoal"
            >
              Our Services
            </Link>
            <Link
              href="/before-after"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold uppercase tracking-wide text-charcoal"
            >
              Before &amp; After
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold uppercase tracking-wide text-charcoal"
            >
              Contact
            </Link>

            <SocialIcons className="mt-2" />

            <ConsultationDialog className="mt-2 bg-teal-dark px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-paper" />
          </div>
        </div>
      )}
    </header>
  );
}
