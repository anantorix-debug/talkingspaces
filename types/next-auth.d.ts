import type { Role } from "@/lib/permissions";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
    };
  }
}

// Note: next-auth/jwt re-exports its JWT interface via `export *`, which does not
// participate in TS declaration merging — augmenting it here has no effect. The JWT
// callback in auth.ts uses explicit casts for `token.role`/`token.id` instead.
