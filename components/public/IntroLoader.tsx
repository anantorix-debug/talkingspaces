import Image from "next/image";

/**
 * Entrance splash — pure CSS keyframes on a fixed timeline (see .intro-* rules
 * in globals.css). No client JS: it always plays and finishes on its own, and
 * pointer-events:none the whole time means it can never block the real page.
 */
export function IntroLoader() {
  return (
    <div className="intro-loader" aria-hidden="true">
      <div className="intro-logo">
        <Image
          src="/images/logo/logo-full-white.png"
          alt=""
          width={1134}
          height={1394}
          className="h-24 w-auto sm:h-36"
          priority
          unoptimized
        />
      </div>
      <div className="intro-panel intro-panel-left" />
      <div className="intro-panel intro-panel-right" />
    </div>
  );
}
