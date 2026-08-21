export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
] as const;

export const AFTER_SERVICES_NAV_LINKS = [
  { label: "Before & After", href: "/before-after" },
  { label: "Contact", href: "/contact" },
] as const;

export const SITE_NAME = "Talking Spaces Interiors";

/**
 * Static site-wide contact/social/brand config. There is no admin-editable
 * Settings model — update these values directly and redeploy.
 */
export const SITE_CONFIG = {
  whatsappNumber: "919159055156",
  phonePrimary: "+91 91590 55156",
  emailPrimary: "talkingspaces.interiors@gmail.com",
  socialInstagram: "",
  socialFacebook: "",
  homepageHeroImages: ["/images/hero/1.webp", "/images/hero/2.webp", "/images/hero/3.webp"],
  homepageStudioImage: "/images/homepage-studio.webp",
  aboutBannerImage: "/images/about/1.webp",
  portfolioBannerImage: "/images/portfolio/hero.webp",
  servicesBannerImage: "/images/services/hero.webp",
  beforeAfterBannerImage: "/images/beforeandafter/hero.webp",
  contactBannerImage: "/images/contact/hero.webp",
  ctaBackgroundImage: "/images/cta/hero.webp",
} as const;

/**
 * Studio branches shown on the Contact page and the footer — hardcoded here
 * instead of admin-managed (the Location admin section was removed).
 */
export const BRANCHES = [
  {
    name: "Bangalore",
    address:
      "# 351, 11th Cross, 1st Main Road, Muneeswara Badavane, Laggerre, Bangalore - 560058, Karnataka, India",
    mapUrl: null as string | null,
  },
  {
    name: "Salem",
    address:
      "Flat C, First Floor, KKDR Brindavan Tamil Appt., Nagaramalai Adivaram Road, Ezhil Nagar, Salem - 636016, Tamil Nadu, India",
    mapUrl: "https://maps.app.goo.gl/NAH9t71G1jztDhQ9A" as string | null,
  },
] as const;

export function whatsappHref(message?: string): string {
  const digits = SITE_CONFIG.whatsappNumber.replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export const CONSULTATION_BUDGET_OPTIONS = [
  { value: "under_5l", label: "Under ₹5 Lakhs" },
  { value: "5_10l", label: "₹5–10 Lakhs" },
  { value: "10_20l", label: "₹10–20 Lakhs" },
  { value: "20_50l", label: "₹20–50 Lakhs" },
  { value: "50l_plus", label: "₹50 Lakhs+" },
  { value: "not_sure", label: "Not sure / Need guidance" },
] as const;
