import type { Metadata } from "next";

import { ContactForm } from "@/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jessy Prananda.",
};

export default function ContactPage() {
  return (
    <main className="px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32 xl:px-16">
      <div className="mx-auto w-full max-w-[640px]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Let&apos;s talk
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600">
          Tell me about your project. This form is a UI scaffold for now —
          message delivery will be connected later.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
