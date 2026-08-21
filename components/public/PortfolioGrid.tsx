import { ProjectCard, type ProjectCardData } from "@/components/public/ProjectCard";
import { ImageReveal } from "@/components/public/ImageReveal";

export function PortfolioGrid({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) {
    return <p className="py-24 text-center text-sm text-charcoal/50">No projects yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {projects.map((project, i) => (
        <ImageReveal key={project.slug} delay={(i % 5) * 0.06}>
          <ProjectCard project={project} priority={i < 2} />
        </ImageReveal>
      ))}
    </div>
  );
}
