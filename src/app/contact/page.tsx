import type { Metadata } from "next";

import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jessy Prananda.",
};

export default function ContactPage() {
  return (
    <main className="bg-paper pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))]">
      <ContactSection />
    </main>
  );
}
