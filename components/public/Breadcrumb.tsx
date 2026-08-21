import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
  dark = false,
}: {
  items: { label: string; href?: string }[];
  dark?: boolean;
}) {
  const base = dark ? "text-cream/60" : "text-charcoal/50";
  const hover = dark ? "hover:text-paper" : "hover:text-charcoal";
  const current = dark ? "text-paper" : "text-charcoal";

  return (
    <nav aria-label="Breadcrumb" className={`text-xs uppercase tracking-wide ${base}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className={hover}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={current}>
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight size={12} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
