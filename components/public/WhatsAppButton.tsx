import { WhatsAppIcon } from "@/components/public/WhatsAppIcon";
import { whatsappHref } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref("Hi, I'd like to know more about Talking Spaces Interiors.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
