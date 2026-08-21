import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { BeforeAfterSlider } from "@/components/public/BeforeAfterSlider";
import { ImageReveal } from "@/components/public/ImageReveal";
import { CTASection } from "@/components/public/CTASection";
import { getPublishedProjectsWithBeforeAfter } from "@/lib/repositories/projects";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Before & After",
  description:
    "Real transformations by Talking Spaces Interiors — drag to compare before and after in each project.",
};

export default async function BeforeAfterPage() {
  const projects = await getPublishedProjectsWithBeforeAfter();

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-teal-dark py-28 text-paper">
        <Image
          src={SITE_CONFIG.beforeAfterBannerImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative z-10">
          <Breadcrumb dark items={[{ label: "Home", href: "/" }, { label: "Before & After" }]} />
          <h1 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            From Ordinary
            <br />
            To Extraordinary.
          </h1>
        </Container>
      </section>

      <section className="py-32">
        <Container>
          {projects.length === 0 ? (
            <p className="py-24 text-center text-sm text-charcoal/50">
              No transformations yet — check back soon.
            </p>
          ) : (
            <div className="space-y-24">
              {projects.map((project) => (
                <ImageReveal key={project.id}>
                  <div>
                    <BeforeAfterSlider
                      beforeImage={project.beforeImage!}
                      afterImage={project.afterImage!}
                    />
                    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-display text-2xl font-light text-charcoal">
                        {project.title}
                      </h2>
                      {project.location && (
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">
                          {project.location}
                        </span>
                      )}
                    </div>
                    {project.shortDescription && (
                      <p className="mt-2 max-w-2xl text-sm text-charcoal/60">{project.shortDescription}</p>
                    )}
                  </div>
                </ImageReveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CTASection heading="Ready For Your Transformation?" imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
