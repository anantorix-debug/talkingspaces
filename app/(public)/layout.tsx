import type { ReactNode } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { IntroLoader } from "@/components/public/IntroLoader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <IntroLoader />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
