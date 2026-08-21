import { Quote } from "lucide-react";

export function TestimonialCard({
  name,
  location,
  content,
}: {
  name: string;
  location?: string | null;
  content: string;
}) {
  return (
    <blockquote className="flex h-full flex-col bg-paper p-8 shadow-sm ring-1 ring-charcoal/10">
      <Quote size={28} className="mb-5 text-teal" fill="currentColor" strokeWidth={0} />
      <p className="flex-1 font-display text-xl font-light leading-relaxed text-charcoal">
        {content}
      </p>
      <footer className="mt-6 border-t border-charcoal/10 pt-4">
        <p className="text-sm font-semibold text-charcoal">{name}</p>
        {location && (
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
            {location}
          </p>
        )}
      </footer>
    </blockquote>
  );
}
