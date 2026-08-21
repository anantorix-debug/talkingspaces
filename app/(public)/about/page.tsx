import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { Container } from "@/components/public/Container";
import { SectionHeading } from "@/components/public/SectionHeading";
import { CTASection } from "@/components/public/CTASection";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Talking Spaces Interiors — an architectural interior design studio founded in 2004, shaping residential, commercial, and clinical spaces.",
};

const PROCESS_STEPS = [
  { step: "01", title: "Concept", description: "Understanding the brief, the site, and how the space needs to work." },
  { step: "02", title: "Design Process", description: "Developing layouts, materials, and detailing into a coherent design." },
  { step: "03", title: "Supervision", description: "On-site execution overseen closely against the design intent." },
  { step: "04", title: "Budget Planning", description: "Transparent costing aligned to scope from the outset." },
];

const TEAM = [
  { name: "Vijayalakshmi", role: "Architect, Founder" },
  { name: "Neilesh Datta", role: "Co-Founder" },
];

const STATS = [
  { value: "20+", label: "Years of Experience" },
  { value: "100+", label: "Projects Completed" },
  { value: "100+", label: "Satisfied Clients" },
  { value: "Multiple", label: "Design Awards" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-teal-dark py-28 text-paper">
        <Image
          src={SITE_CONFIG.aboutBannerImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative z-10">
          <Breadcrumb dark items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <h1 className="mt-6 font-display text-6xl font-light leading-[1.05] tracking-[-0.02em] sm:text-7xl">
            About Talking Spaces
          </h1>
        </Container>
      </section>

      <section className="py-28">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Since 2004" heading="A Studio Built On Craft." align="center" />
          <p className="mt-8 text-center text-lg leading-relaxed text-charcoal/70">
            Talking Spaces Interiors has spent two decades shaping residential, commercial, and
            clinical spaces across Bangalore and Salem. Every project starts from the same
            question — how should this space feel to the people who use it — and is carried
            through with a deep understanding of architectural principles and an uncompromising
            dedication to detail.
          </p>
        </Container>
      </section>

      <section className="bg-teal-light/40 py-28">
        <Container className="max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/50">
            Design Philosophy
          </p>
          <blockquote className="font-display text-3xl font-light leading-snug text-charcoal sm:text-4xl">
            &ldquo;Interior design is the art and science of enhancing the interior of a building
            to achieve a healthier and more aesthetically pleasing environment for the people
            using the space.&rdquo;
          </blockquote>
        </Container>
      </section>

      <section className="py-28">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-light text-charcoal sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-teal-light/40 py-28">
        <Container>
          <SectionHeading eyebrow="How We Work" heading="Our Approach." />
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step}>
                <p className="font-display text-3xl font-light text-charcoal/30">{step.step}</p>
                <h3 className="mt-4 font-display text-xl font-light text-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-28">
        <Container>
          <SectionHeading eyebrow="Leadership" heading="The Team." />
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2">
            {TEAM.map((member) => (
              <div key={member.name} className="border-t border-charcoal/10 pt-8">
                <h3 className="font-display text-2xl font-light text-charcoal">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection heading="Let's Create Your Space." imageUrl={SITE_CONFIG.ctaBackgroundImage} />
    </>
  );
}
