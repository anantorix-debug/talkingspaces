"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ServiceGrid, type ServiceCardData } from "@/components/public/ServiceGrid";

export function ServicesFilterGrid({ services }: { services: ServiceCardData[] }) {
  const [query, setQuery] = useState("");

  if (services.length === 0) {
    return <p className="py-24 text-center text-sm text-charcoal/50">No services published yet — check back soon.</p>;
  }

  const filtered = query.trim()
    ? services.filter((s) => {
        const q = query.trim().toLowerCase();
        return s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q);
      })
    : services;

  return (
    <div>
      <div className="relative mx-auto mb-16 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services..."
          aria-label="Search services"
          className="w-full border border-charcoal/15 bg-paper py-3 pl-11 pr-4 text-sm text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-teal focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-sm text-charcoal/50">No services match &ldquo;{query}&rdquo;.</p>
      ) : (
        <ServiceGrid services={filtered} />
      )}
    </div>
  );
}
