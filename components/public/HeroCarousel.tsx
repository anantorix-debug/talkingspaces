"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDE_DURATION_MS = 6000;

type RequestIdleCallback = (cb: () => void) => number;

export function HeroCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only slide 0 mounts up front — it's the true LCP candidate. Native
  // browser lazy-loading defers by viewport proximity, not CSS opacity, so a
  // naive carousel that mounts every slide immediately still forces the
  // browser to fetch all of them at once (they're all "in the viewport"
  // even at opacity:0), competing with the real first-paint image for
  // bandwidth. The rest load during idle time instead.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const idle: RequestIdleCallback =
      (window as unknown as { requestIdleCallback?: RequestIdleCallback }).requestIdleCallback ??
      ((cb) => window.setTimeout(cb, 1500));
    const handle = idle(() => {
      setLoaded(new Set(images.map((_, i) => i)));
    });
    return () => window.clearTimeout(handle as unknown as number);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || paused || reduceMotionRef.current) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => {
        if (!loaded.has(i)) return null;
        return (
          <div
            key={src}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <div className={i === active ? "h-full w-full animate-hero-zoom" : "h-full w-full"}>
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-paper" : "w-1.5 bg-paper/40 hover:bg-paper/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
