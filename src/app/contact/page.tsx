import type { Metadata } from "next";

import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jessy Prananda.",
};

export default function ContactPage() {
  return (
    <main className="bg-slate-50/60 pt-24 md:pt-28">
      <ContactSection />
    </main>
  );
}
