"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [value, setValue] = useState(50);

  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden bg-teal-light">
      <Image src={afterImage} alt={afterLabel} fill sizes="100vw" className="object-cover" />

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={beforeImage} alt={beforeLabel} fill sizes="100vw" className="object-cover" />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper"
        style={{ left: `${value}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper shadow-lg">
          <MoveHorizontal size={18} className="text-charcoal" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={`Drag to compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />

      <span className="pointer-events-none absolute left-3 top-3 bg-teal-dark/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-paper">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-teal-dark/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-paper">
        {afterLabel}
      </span>
    </div>
  );
}
