import { ServiceCard } from "@/components/public/ServiceCard";
import { ImageReveal } from "@/components/public/ImageReveal";

export type ServiceCardData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: string | null;
};

export function ServiceGrid({ services }: { services: ServiceCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      {services.map((service, i) => (
        <ImageReveal key={service.id} delay={i * 0.1}>
          <ServiceCard
            index={i + 1}
            title={service.title}
            slug={service.slug}
            shortDescription={service.shortDescription}
            heroImage={service.heroImage}
          />
        </ImageReveal>
      ))}
    </div>
  );
}
