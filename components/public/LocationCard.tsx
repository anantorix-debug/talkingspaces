import { MapPin, Phone, Mail } from "lucide-react";

export function LocationCard({
  name,
  address,
  phone,
  email,
  mapUrl,
}: {
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  mapUrl?: string | null;
}) {
  const externalMapHref = mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="border border-charcoal/10 p-8">
      <h3 className="font-display text-2xl font-light text-charcoal">{name}</h3>
      <div className="mt-4 space-y-3 text-sm text-charcoal/70">
        <p className="flex gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-charcoal/40" aria-hidden="true" />
          <span>{address}</span>
        </p>
        {phone && (
          <p className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-charcoal/40" aria-hidden="true" />
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-charcoal">
              {phone}
            </a>
          </p>
        )}
        {email && (
          <p className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-charcoal/40" aria-hidden="true" />
            <a href={`mailto:${email}`} className="hover:text-charcoal">
              {email}
            </a>
          </p>
        )}
      </div>

      <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-charcoal/10 bg-teal-light/40">
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
          title={`Map showing ${name}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <a
        href={externalMapHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-charcoal link-underline"
      >
        View on map
      </a>
    </div>
  );
}
