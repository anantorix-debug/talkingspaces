import type { ReactNode } from "react";

/**
 * Pure-CSS fade-up — deliberately not JS/IntersectionObserver-driven. A scroll-triggered
 * (whileInView) animation renders with opacity:0 until hydration + the observer fire,
 * which flashes blank content on slow connections and hurts Lighthouse/CLS. This animates
 * once on paint via the `.reveal` keyframes in globals.css, so content is never JS-gated,
 * and prefers-reduced-motion is already respected there.
 */
export function ImageReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
