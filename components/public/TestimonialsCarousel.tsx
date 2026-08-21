"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/public/TestimonialCard";

const SLIDE_DURATION_MS = 7000;

export type TestimonialSlideData = {
  id: string;
  name: string;
  location?: string | null;
  content: string;
};

export function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialSlideData[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1 || paused || reduceMotionRef.current) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [testimonials.length, paused]);

  function go(delta: number) {
    setActive((prev) => (prev + delta + testimonials.length) % testimonials.length);
  }

  if (testimonials.length === 0) return null;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-2xl">
        {testimonials.map((t, i) => (
          <div key={t.id} className={i === active ? "block" : "hidden"} aria-hidden={i !== active}>
            <TestimonialCard name={t.name} location={t.location} content={t.content} />
          </div>
        ))}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="text-charcoal/40 transition-colors hover:text-teal"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-teal" : "w-1.5 bg-charcoal/20 hover:bg-charcoal/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="text-charcoal/40 transition-colors hover:text-teal"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
