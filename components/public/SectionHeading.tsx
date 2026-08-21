import { ImageReveal } from "@/components/public/ImageReveal";

type Props = {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
  dark?: boolean;
};

export function SectionHeading({ eyebrow, heading, align = "left", dark = false }: Props) {
  return (
    <ImageReveal>
      <div className={align === "center" ? "text-center" : "text-left"}>
        {eyebrow && (
          <p
            className={`mb-3 text-xs font-semibold uppercase tracking-[0.15em] ${
              dark ? "text-cream" : "text-charcoal/60"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-display text-4xl font-light leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-6xl ${
            dark ? "text-paper" : "text-charcoal"
          }`}
        >
          {heading}
        </h2>
      </div>
    </ImageReveal>
  );
}
