import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
} from "lucide-react";

import { ContactForm } from "@/components/shared/ContactForm";
import { contactConfig, getWhatsAppUrl } from "@/config/contact";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.031 0C5.402 0 .036 5.367.033 11.996c-.001 2.115.552 4.18 1.601 5.997L0 24l6.235-1.635a11.94 11.94 0 0 0 5.793 1.475h.005c6.628 0 11.994-5.367 11.997-11.996a11.9 11.9 0 0 0-3.51-8.481A11.907 11.907 0 0 0 12.031 0zm0 21.945h-.004a9.93 9.93 0 0 1-5.062-1.386l-.363-.215-3.7.97.988-3.607-.236-.37a9.9 9.9 0 0 1-1.522-5.32c.003-5.484 4.465-9.945 9.953-9.945a9.9 9.9 0 0 1 7.041 2.919 9.9 9.9 0 0 1 2.912 7.037c-.003 5.484-4.465 9.917-9.997 9.917z" />
    </svg>
  );
}

const socialIcons = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Instagram: InstagramIcon,
  Mail: ({ className }: { className?: string }) => (
    <Mail aria-hidden="true" className={className} strokeWidth={2} />
  ),
} as const;

const cardClass =
  "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";

export function ContactSection() {
  const whatsappUrl = getWhatsAppUrl();
  const { isAvailableForWork, whatsapp, socials } = contactConfig;

  return (
    <section
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-[900px] px-5 py-16 md:px-8"
    >
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.5px] text-orange-600">
          CONTACT
        </p>
        <h1
          id="contact-heading"
          className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-slate-950 md:text-[40px]"
        >
          Let&apos;s talk
        </h1>
        <p className="mt-3 max-w-[520px] text-[15px] leading-7 text-slate-600">
          The fastest way to reach me is WhatsApp. Tell me about your project,
          timeline, and goals — I usually reply within a few hours.
        </p>

        <ul className="mt-5 flex flex-wrap gap-2.5">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            <Clock aria-hidden="true" className="size-3.5" strokeWidth={2} />
            {contactConfig.responseLabel}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            <MapPin aria-hidden="true" className="size-3.5" strokeWidth={2} />
            {contactConfig.locationLabel}
          </li>
          {isAvailableForWork ? (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
              <CheckCircle2
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={2}
              />
              {contactConfig.availableLabel}
            </li>
          ) : null}
        </ul>
      </header>

      <div className="mt-8 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <WhatsAppGlyph className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Chat on WhatsApp
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Fastest response
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-5 inline-flex h-10 w-full items-center justify-center
              rounded-lg bg-slate-950 text-sm font-medium text-white
              transition hover:bg-slate-800
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-orange-500 focus-visible:ring-offset-2
            "
          >
            Chat on WhatsApp
          </a>

          <p className="mt-3 text-center text-xs text-slate-500">
            or save the number {whatsapp.display}
          </p>

          <div className="my-5 h-px bg-slate-200" role="separator" />

          <ul className="flex items-center gap-4">
            {socials.map((social) => {
              const Icon = socialIcons[social.label];
              const isExternal = social.href.startsWith("http");

              return (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    aria-label={social.label}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex text-slate-500 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <Icon className="size-[18px]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={cardClass}>
          <h2 className="text-sm font-semibold text-slate-950">
            Or send a short message
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            I check email every day.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
