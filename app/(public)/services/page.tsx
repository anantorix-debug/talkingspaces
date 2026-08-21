import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { ServicesFilterGrid } from "@/components/public/ServicesFilterGrid";
import { CTASection } from "@/components/public/CTASection";
import { getPublishedServices } from "@/lib/repositories/services";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Residential, commercial, and clinical interior design services from Talking Spaces Interiors.",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-teal-dark py-28 text-paper">
        <Image
          src={SITE_CONFIG.servicesBannerImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative z-10">
          <Breadcrumb dark items={[{ label: "Home", href: "/" }, { label: "Our Services" }]} />
          <h1 className="mt-6 font-display text-6xl font-light leading-[1.05] tracking-[-0.02em] sm:text-7xl">
            Our Services
          </h1>
        </Container>
      </section>

      <section className="py-28">
        <Container>
          <ServicesFilterGrid services={services} />
        </Container>
      </section>

      <CTASection heading="Let's Create Your Space." imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
