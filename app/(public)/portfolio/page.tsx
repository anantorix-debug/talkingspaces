import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { CTASection } from "@/components/public/CTASection";
import { getPublishedProjects } from "@/lib/repositories/projects";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A portfolio of residential, commercial, and clinical interior design projects by Talking Spaces Interiors.",
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-teal-dark py-28 text-paper">
        <Image
          src={SITE_CONFIG.portfolioBannerImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative z-10">
          <Breadcrumb dark items={[{ label: "Home", href: "/" }, { label: "Portfolio" }]} />
          <h1 className="mt-6 font-display text-6xl font-light leading-[1.05] tracking-[-0.02em] sm:text-7xl">
            Portfolio
          </h1>
        </Container>
      </section>

      <section className="pb-32 pt-16">
        <Container>
          <PortfolioGrid
            projects={projects.map((p) => ({
              slug: p.slug,
              title: p.title,
              location: p.location,
              coverImageUrl: p.imageUrl,
            }))}
          />
        </Container>
      </section>

      <CTASection heading="Have A Project In Mind?" imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
