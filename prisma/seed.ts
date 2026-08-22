import { PrismaClient, RoleName, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Roles ---------------------------------------------------------------
  const [masterRole, _adminRole, _editorRole] = await Promise.all(
    [RoleName.MASTER_ADMIN, RoleName.ADMIN, RoleName.EDITOR].map((name) =>
      prisma.role.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );

  // --- Users -----------------------------------------------------------------
  // Seed credentials are for local development only — rotate before production launch.
  const masterPassword = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@talkingspaces.co.in" },
    update: {},
    create: {
      name: "Master Admin",
      email: "admin@talkingspaces.co.in",
      passwordHash: masterPassword,
      roleId: masterRole.id,
    },
  });

  if (process.env.NODE_ENV === "production") {
    console.log("Production seed: roles + admin account only, skipping sample content.");
    return;
  }

  // --- Categories + their Service page content (Category is the parent) ------
  const categoryDefs = [
    {
      slug: "residential",
      name: "Residential",
      sortOrder: 1,
      shortDescription: "Bespoke interiors shaped around how your family actually lives.",
      description:
        "From single rooms to full-home interiors, we design residential spaces around light, materiality, and how a family actually lives — every layout is developed to feel considered rather than decorated.",
    },
    {
      slug: "commercial",
      name: "Commercial",
      sortOrder: 2,
      shortDescription: "Strategic spatial design that blends brand identity with everyday function.",
      description:
        "Commercial fit-outs designed to work as hard as the business inside them — durable materials, efficient circulation, and a spatial identity that reflects the brand without sacrificing day-to-day usability.",
    },
    {
      slug: "clinics",
      name: "Clinics",
      sortOrder: 3,
      shortDescription: "Functional, serene, and compliant patient-facing spaces engineered for efficiency.",
      description:
        "Clinical interiors that balance regulatory and operational requirements with a calm, reassuring patient experience — planned in close coordination with medical equipment and workflow needs.",
    },
  ];

  const categories: Record<string, { id: number; name: string }> = {};
  for (const def of categoryDefs) {
    const category = await prisma.projectCategory.upsert({
      where: { slug: def.slug },
      update: { sortOrder: def.sortOrder },
      create: { name: def.name, slug: def.slug, status: ContentStatus.PUBLISHED, sortOrder: def.sortOrder },
    });
    categories[def.slug] = category;

    await prisma.service.upsert({
      where: { categoryId: category.id },
      update: { shortDescription: def.shortDescription, description: def.description },
      create: {
        categoryId: category.id,
        shortDescription: def.shortDescription,
        description: def.description,
      },
    });
  }

  // --- Projects (real project names from talkingspaces.co.in) ------------------
  // Image fields reuse the site's existing photography (no dedicated per-project
  // shoots exist yet) so every card/detail/before-after page has something to render.
  const projectSeeds = [
    {
      slug: "vijays-mansion",
      title: "Vijay's Mansion",
      location: "Bangalore",
      featured: true,
      shortDescription: "A full residential interior built around light, texture, and quiet material honesty.",
      imageUrl: "/images/hero/1.webp",
      beforeImage: "/images/hero/2.webp",
      afterImage: "/images/hero/1.webp",
    },
    {
      slug: "ashok-kalra",
      title: "Ashok Kalra",
      location: "Bangalore",
      featured: true,
      shortDescription: "A residence reworked around warm wood tones and considered spatial flow.",
      imageUrl: "/images/hero/2.webp",
      beforeImage: "/images/about/1.webp",
      afterImage: "/images/hero/2.webp",
    },
    {
      slug: "dentist-corner",
      title: "Dentist Corner",
      location: "Salem",
      featured: true,
      shortDescription: "A dental clinic interior designed for patient calm and clinical efficiency.",
      imageUrl: "/images/hero/3.webp",
      beforeImage: "/images/services/hero.webp",
      afterImage: "/images/hero/3.webp",
    },
    {
      slug: "svasthi-cardio-dental-clinic",
      title: "Svasthi Cardio & Dental Clinic",
      location: "Salem",
      featured: false,
      shortDescription: "A combined cardio and dental practice planned around dual clinical workflows.",
      imageUrl: "/images/homepage-studio.webp",
      beforeImage: null,
      afterImage: null,
    },
  ];

  for (const [index, p] of projectSeeds.entries()) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        imageUrl: p.imageUrl,
        beforeImage: p.beforeImage,
        afterImage: p.afterImage,
      },
      create: {
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.shortDescription,
        location: p.location,
        year: 2023,
        featured: p.featured,
        status: ContentStatus.PUBLISHED,
        sortOrder: index,
        imageUrl: p.imageUrl,
        beforeImage: p.beforeImage,
        afterImage: p.afterImage,
      },
    });
  }

  // --- Testimonials --------------------------------------------------------
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Client, Bangalore",
        location: "Bangalore",
        content:
          "A professional attitude and an efficient team from start to finish — the project was delivered time-bound without compromising on quality.",
        status: ContentStatus.PUBLISHED,
        sortOrder: 1,
      },
      {
        name: "Client, Salem",
        location: "Salem",
        content:
          "Creative and experienced — they understood exactly what we wanted and found a budget-friendly way to get there.",
        status: ContentStatus.PUBLISHED,
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
