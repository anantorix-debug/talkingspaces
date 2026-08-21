import Link from "next/link";
import Image from "next/image";

/**
 * Single combined icon+wordmark crest image — "TALKING SPACES" is baked into the
 * graphic itself rather than set as separate HTML text alongside a plain icon.
 * dark=false (light backgrounds) → teal ink. dark=true (dark backgrounds) → white ink.
 */
export function Logo({
  dark = false,
  className = "h-8 w-auto",
  priority = false,
}: {
  dark?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" aria-label="Talking Spaces Interiors — Home" className="inline-block">
      <Image
        src={dark ? "/images/logo/logo-full-white.png" : "/images/logo/logo-full-teal.png"}
        alt="Talking Spaces Interiors"
        width={1134}
        height={1394}
        className={className}
        priority={priority}
        unoptimized
      />
    </Link>
  );
}
