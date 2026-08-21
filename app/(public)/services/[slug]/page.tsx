import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProjectGrid } from "@/components/public/ProjectGrid";
import { ImageReveal } from "@/components/public/ImageReveal";
import { CTASection } from "@/components/public/CTASection";
import { getServiceBySlug } from "@/lib/repositories/services";
import { getPublishedProjects } from "@/lib/repositories/projects";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.shortDescription };
}

const PROCESS_STEPS = [
  { step: "01", title: "Consultation", description: "Understanding your brief, site, and constraints." },
  { step: "02", title: "Design Development", description: "Layouts, materials, and detailing refined together." },
  { step: "03", title: "Execution", description: "On-site delivery supervised against the design intent." },
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const recentProjects = await getPublishedProjects(3);

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-teal-dark">
        {service.heroImage && (
          <Image
            src={service.heroImage}
            alt={service.title}
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
              { label: "Our Services" },
              { label: service.title },
            ]}
          />
          <h1 className="mt-6 font-display text-6xl font-light leading-[1.05] tracking-[-0.02em] sm:text-7xl">
            {service.title}
          </h1>
        </Container>
      </section>

      <section className="py-24">
        <Container className="max-w-3xl">
          <ImageReveal>
            <p className="text-lg leading-relaxed text-charcoal/70">{service.description}</p>
          </ImageReveal>
        </Container>
      </section>

      <section className="bg-teal-light/40 py-24">
        <Container>
          <SectionHeading eyebrow="Our Process" heading="How We Deliver." />
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <ImageReveal key={step.step}>
                <div>
                  <p className="font-display text-3xl font-light text-charcoal/30">{step.step}</p>
                  <h3 className="mt-4 font-display text-xl font-light text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{step.description}</p>
                </div>
              </ImageReveal>
            ))}
          </div>
        </Container>
      </section>

      {recentProjects.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading eyebrow="Featured Work" heading="Recent Projects." />
            <div className="mt-16">
              <ProjectGrid
                projects={recentProjects.map((p) => ({
                  slug: p.slug,
                  title: p.title,
                  location: p.location,
                  coverImageUrl: p.imageUrl,
                }))}
              />
            </div>
          </Container>
        </section>
      )}

      <CTASection heading="Let's Create Your Space." imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
