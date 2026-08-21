import Image from "next/image";
import Link from "next/link";

export function ServiceCard({
  index,
  title,
  slug,
  shortDescription,
  heroImage,
}: {
  index: number;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage?: string | null;
}) {
  return (
    <Link href={`/services/${slug}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-teal-light">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl font-light text-charcoal/20">
              {String(index).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">
        {String(index).padStart(2, "0")}
      </p>
      <h3 className="mt-1 font-display text-2xl font-light text-charcoal">{title}</h3>
      <p className="mt-2 text-sm text-charcoal/60">{shortDescription}</p>
    </Link>
  );
}
