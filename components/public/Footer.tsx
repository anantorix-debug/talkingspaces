import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { SocialIcons } from "@/components/public/SocialIcons";
import { NAV_LINKS, SITE_CONFIG, BRANCHES } from "@/lib/constants";
import { getPublishedServices } from "@/lib/repositories/services";

export async function Footer() {
  const year = new Date().getFullYear();
  const services = await getPublishedServices();

  return (
    <footer className="bg-teal-dark text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4 lg:px-16">
        <div>
          <div className="flex items-center gap-2">
            <Logo dark className="h-28 w-auto" />
            <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-teal-light">
              Talking Spaces
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Architectural interior design. Transforming spaces into lasting, tangible environments.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/80 hover:text-teal-light">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/before-after" className="text-cream/80 hover:text-teal-light">
                Before &amp; After
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-cream/80 hover:text-teal-light">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {services.length > 0 && (
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link href={`/services/${service.slug}`} className="text-cream/80 hover:text-teal-light">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
            Connect
          </h3>
          <ul className="space-y-3 text-sm text-cream/80">
            <li>{SITE_CONFIG.phonePrimary}</li>
            <li>
              <a href={`mailto:${SITE_CONFIG.emailPrimary}`} className="hover:text-teal-light">
                {SITE_CONFIG.emailPrimary}
              </a>
            </li>
            {BRANCHES.map((branch) => (
              <li key={branch.name}>{branch.name}</li>
            ))}
          </ul>
          <SocialIcons dark className="mt-5" />
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-6 text-center text-xs uppercase tracking-wide text-cream/50 lg:px-16">
        © {year} Talking Spaces Interiors. All Rights Reserved.
      </div>
    </footer>
  );
}
