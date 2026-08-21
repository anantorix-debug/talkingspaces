import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProjectGrid } from "@/components/public/ProjectGrid";
import { ServiceGrid } from "@/components/public/ServiceGrid";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { CTASection } from "@/components/public/CTASection";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { Container } from "@/components/public/Container";
import { ImageReveal } from "@/components/public/ImageReveal";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { getFeaturedProjects } from "@/lib/repositories/projects";
import { getPublishedServices } from "@/lib/repositories/services";
import { getPublishedTestimonials } from "@/lib/repositories/testimonials";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, services, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getPublishedServices(),
    getPublishedTestimonials(6),
  ]);

  return (
    <>
      {/* SECTION 01 — HERO */}
      <section className="relative flex min-h-[900px] items-center justify-center overflow-hidden bg-teal-dark px-6 py-40">
        <HeroCarousel images={[...SITE_CONFIG.homepageHeroImages]} />
        <div className="absolute inset-0 bg-overlay" />
        <ImageReveal>
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-cream">
              Since 2004
            </p>
            <h1 className="font-display text-6xl font-light leading-[1.05] tracking-[-0.03em] text-paper sm:text-7xl lg:text-8xl">
              Best Interior
              <br />
              Designs For
              <br />
              You
            </h1>
            <p className="mt-8 max-w-xl text-lg font-light text-cream">
              Elevating environments through meticulous design, timeless aesthetics, and
              uncompromising craftsmanship.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/portfolio"
                className="btn-lift bg-paper px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-teal-dark transition-colors hover:bg-teal-light"
              >
                Explore Our Work
              </Link>
              <ConsultationDialog
                label="Start Your Project"
                className="btn-lift border border-paper px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-colors hover:bg-paper hover:text-teal-dark"
              />
            </div>
          </div>
        </ImageReveal>
      </section>

      {/* SECTION 02 — STUDIO */}
      <section className="py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <ImageReveal>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60">
                  Talking Spaces Interiors
                </p>
                <h2 className="font-display text-5xl font-light leading-[1.1] tracking-[-0.02em] text-charcoal lg:text-6xl">
                  We Create Spaces With Character.
                </h2>
                <p className="mt-8 text-base leading-relaxed text-charcoal/70">
                  Since 2004, we have been crafting environments that resonate with the people who
                  inhabit them. Our approach is rooted in a deep understanding of architectural
                  principles and an uncompromising dedication to detail.
                </p>
                <p className="mt-4 text-base leading-relaxed text-charcoal/70">
                  Specializing in residential, commercial, and clinical spaces, we transform empty
                  shells into curated experiences that stand the test of time.
                </p>
                <Link
                  href="/about"
                  className="mt-10 inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-charcoal link-underline"
                >
                  About Talking Spaces
                  <ArrowUpRight size={14} className="shrink-0" />
                </Link>
              </div>
            </ImageReveal>
            <ImageReveal delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-teal-light">
                <Image
                  src={SITE_CONFIG.homepageStudioImage}
                  alt="Talking Spaces Interiors studio work"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </div>
        </Container>
      </section>

      {/* SECTION 03 — FEATURED WORK */}
      <section className="bg-teal-light/40 py-32">
        <Container>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Selected Works" heading="Spaces We've Brought To Life." />
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-charcoal link-underline"
            >
              View All Projects
              <ArrowUpRight size={14} className="shrink-0" />
            </Link>
          </div>
          {featuredProjects.length > 0 ? (
            <ProjectGrid
              projects={featuredProjects.map((p) => ({
                slug: p.slug,
                title: p.title,
                location: p.location,
                coverImageUrl: p.imageUrl,
              }))}
            />
          ) : (
            <p className="py-16 text-center text-sm text-charcoal/50">
              Featured projects coming soon — check back shortly.
            </p>
          )}
        </Container>
      </section>

      {/* SECTION 04 — SERVICES */}
      <section className="py-32">
        <Container>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="What We Do" heading="Designing For Every Kind Of Space." />
            <Link
              href="/before-after"
              className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-charcoal link-underline"
            >
              Before &amp; After
              <ArrowUpRight size={14} className="shrink-0" />
            </Link>
          </div>
          {services.length > 0 ? (
            <ServiceGrid services={services} />
          ) : (
            <p className="py-16 text-center text-sm text-charcoal/50">
              Our services list is coming soon — check back shortly.
            </p>
          )}
        </Container>
      </section>

      {/* SECTION 05 — TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-teal-light/40 py-32">
          <Container>
            <SectionHeading eyebrow="Client Voices" heading="What They Say." align="center" />
            <div className="mt-16">
              <TestimonialsCarousel testimonials={testimonials} />
            </div>
          </Container>
        </section>
      )}

      {/* SECTION 06 — CONSULTATION CTA */}
      <CTASection heading="Let's Create Your Space." imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
