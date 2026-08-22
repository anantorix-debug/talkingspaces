// Temporary deploy diagnostic — logs the *shape* of DATABASE_URL as the running
// process actually sees it (never the password itself), to check it matches
// what was set in the hosting panel. Remove once the Hostinger DB auth issue
// is resolved.
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.log("[db-diagnostic] DATABASE_URL is not set at all");
    return;
  }

  console.log("[db-diagnostic] DATABASE_URL raw length:", raw.length);

  try {
    const parsed = new URL(raw);
    console.log("[db-diagnostic] parsed:", {
      protocol: parsed.protocol,
      username: parsed.username,
      passwordLength: parsed.password.length,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
    });
  } catch (error) {
    console.log("[db-diagnostic] failed to parse as URL:", (error as Error).message);
  }
}
