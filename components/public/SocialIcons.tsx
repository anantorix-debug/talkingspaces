import { Instagram, Facebook } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function SocialIcons({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const { socialInstagram, socialFacebook } = SITE_CONFIG;
  const iconClass = dark ? "text-paper hover:text-teal-light" : "text-charcoal hover:text-teal";

  if (!socialInstagram && !socialFacebook) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialInstagram && (
        <a
          href={socialInstagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Talking Spaces Interiors on Instagram"
          className={`transition-colors ${iconClass}`}
        >
          <Instagram size={18} strokeWidth={1.5} />
        </a>
      )}
      {socialFacebook && (
        <a
          href={socialFacebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Talking Spaces Interiors on Facebook"
          className={`transition-colors ${iconClass}`}
        >
          <Facebook size={18} strokeWidth={1.5} />
        </a>
      )}
    </div>
  );
}
