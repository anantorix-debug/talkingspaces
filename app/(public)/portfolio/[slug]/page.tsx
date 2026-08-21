import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { ImageReveal } from "@/components/public/ImageReveal";
import { CTASection } from "@/components/public/CTASection";
import { getProjectBySlug } from "@/lib/repositories/projects";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-teal-dark">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative z-10 pb-16 pt-40 text-paper">
          <Breadcrumb
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Portfolio", href: "/portfolio" },
              { label: project.title },
            ]}
          />
          <h1 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-[-0.02em] sm:text-6xl">
            {project.title}
          </h1>
          {(project.location || project.year) && (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-cream">
              {[project.location, project.year].filter(Boolean).join(" · ")}
            </p>
          )}
        </Container>
      </section>

      <section className="py-24">
        <Container className="max-w-3xl">
          <ImageReveal>
            <p className="text-lg leading-relaxed text-charcoal/70">{project.description}</p>
          </ImageReveal>
        </Container>
      </section>

      <CTASection heading="Start A Project Like This." imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
