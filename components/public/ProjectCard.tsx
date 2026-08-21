import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type ProjectCardData = {
  slug: string;
  title: string;
  location?: string | null;
  coverImageUrl?: string | null;
};

export function ProjectCard({ project, priority = false }: { project: ProjectCardData; priority?: boolean }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden bg-teal-light">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-xl font-light text-charcoal/30">{project.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-teal-dark/0 transition-colors duration-500 group-hover:bg-teal-dark/40" />
        <div className="absolute inset-0 flex items-end p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.15em] text-paper">
            View Project
            <ArrowUpRight size={14} className="shrink-0" />
          </span>
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-light text-charcoal">{project.title}</h3>
      {project.location && <p className="mt-1 text-sm text-charcoal/60">{project.location}</p>}
    </Link>
  );
}
