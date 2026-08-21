import { ProjectCard, type ProjectCardData } from "@/components/public/ProjectCard";
import { ImageReveal } from "@/components/public/ImageReveal";

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) {
    return <p className="py-16 text-center text-sm text-charcoal/50">No projects to show yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <ImageReveal key={project.slug} delay={(i % 3) * 0.08}>
          <ProjectCard project={project} />
        </ImageReveal>
      ))}
    </div>
  );
}
