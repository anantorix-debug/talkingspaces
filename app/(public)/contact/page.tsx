import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { LocationCard } from "@/components/public/LocationCard";
import { ContactForm } from "@/components/public/ContactForm";
import { ImageReveal } from "@/components/public/ImageReveal";
import { SITE_CONFIG, BRANCHES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Talking Spaces Interiors — Bangalore and Salem studios. Send an enquiry and we'll respond shortly.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-teal-dark py-28 text-paper">
        <Image
          src={SITE_CONFIG.contactBannerImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative z-10">
          <Breadcrumb dark items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <h1 className="mt-6 font-display text-6xl font-light leading-[1.05] tracking-[-0.02em] sm:text-7xl">
            Get In Touch
          </h1>
        </Container>
      </section>

      <section className="bg-teal-light/40 py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ImageReveal>
              <div className="h-full border border-charcoal/10 bg-paper p-8">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-charcoal/40" aria-hidden="true" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/50">
                      Call Us
                    </h3>
                    <a
                      href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s/g, "")}`}
                      className="mt-2 block text-lg text-charcoal hover:text-charcoal/70"
                    >
                      {SITE_CONFIG.phonePrimary}
                    </a>
                  </div>
                </div>
                <div className="mt-8 flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-charcoal/40" aria-hidden="true" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/50">
                      Email Us
                    </h3>
                    <a
                      href={`mailto:${SITE_CONFIG.emailPrimary}`}
                      className="mt-2 block break-all text-lg text-charcoal hover:text-charcoal/70"
                    >
                      {SITE_CONFIG.emailPrimary}
                    </a>
                  </div>
                </div>
              </div>
            </ImageReveal>

            {BRANCHES.map((branch, i) => (
              <ImageReveal key={branch.name} delay={(i + 1) * 0.08}>
                <LocationCard name={`Branch ${i + 1}`} address={branch.address} mapUrl={branch.mapUrl} />
              </ImageReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-28">
        <Container>
          <ImageReveal>
            <div className="mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-light text-charcoal">Send An Enquiry</h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
                Tell us a little about your space and we&apos;ll get back to you shortly.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </ImageReveal>
        </Container>
      </section>
    </>
  );
}
