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

  // Categories and Projects are never seeded — real content is entered
  // through the admin panel only, on every environment including local dev.

  if (process.env.NODE_ENV === "production") {
    console.log("Production seed: roles + admin account only, skipping sample content.");
    return;
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
