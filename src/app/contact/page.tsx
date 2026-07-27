import type { Metadata } from "next";
import { WhatsAppCard } from "@/components/shared/WhatsAppCard";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jessy Prananda.",
};

export default function ContactPage() {
  return (
    <main className="px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32 xl:px-16">
      <div className="mx-auto flex w-full max-w-[640px] gap-5 sm:gap-8">
        <div
          aria-hidden="true"
          className="relative hidden w-px shrink-0 overflow-hidden bg-slate-900/80 sm:block"
        >
          <span className="absolute bottom-0 left-0 h-20 w-px bg-orange-500" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            The fastest way to reach me is on WhatsApp. Tell me about your
            project, timeline, and goals &mdash; I usually reply within a few
            hours.
          </p>

          <WhatsAppCard />
        </div>
      </div>
    </main>
  );
}

