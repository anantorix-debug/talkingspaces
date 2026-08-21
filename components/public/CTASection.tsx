import Image from "next/image";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { ImageReveal } from "@/components/public/ImageReveal";
import { whatsappHref } from "@/lib/constants";

export function CTASection({
  heading,
  imageUrl,
}: {
  heading: string;
  imageUrl?: string | null;
}) {
  return (
    <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-teal-dark py-40">
      {imageUrl && (
        <Image src={imageUrl} alt="" fill sizes="100vw" className="object-cover opacity-60" />
      )}
      <div className="absolute inset-0 bg-overlay" />
      <ImageReveal>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-5xl font-light leading-[1.1] tracking-[-0.02em] text-paper sm:text-6xl">
            {heading}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ConsultationDialog className="btn-lift inline-flex items-center justify-center gap-2 bg-paper px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-teal-dark transition-colors hover:bg-teal-light" />
            <a
              href={whatsappHref("Hi, I'd like to know more about Talking Spaces Interiors.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lift inline-flex items-center justify-center gap-2 border border-paper px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition-colors hover:bg-paper hover:text-teal-dark"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </ImageReveal>
    </section>
  );
}
