import { prisma } from "@/lib/prisma";

export function getAllUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { role: true } });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, include: { role: true } });
}

export function getAllRoles() {
  return prisma.role.findMany({ orderBy: { name: "asc" } });
}
