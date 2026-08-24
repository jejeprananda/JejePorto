"use client";

import { useState } from "react";

import { ServiceDetailModal } from "@/components/shared/ServiceDetailModal";
import type { Service } from "@/types/service";

type ServicesSectionProps = {
  services: Service[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <>
      <section
        id="services"
        aria-labelledby="services-title"
        className="scroll-mt-24 bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <header className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              What I build
            </p>
            <h2
              id="services-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
            >
              Services
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base">
              Practical products across platforms, focused on real user needs.
            </p>
          </header>

          {services.length === 0 ? (
            <p className="mt-12 border-y border-rule py-10 text-sm text-ink-muted">
              No services available yet.
            </p>
          ) : (
            <dl className="mt-12 border-t border-rule">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="grid gap-3 border-b border-rule py-6 lg:grid-cols-[16rem_minmax(0,1fr)_auto] lg:items-baseline"
                >
                  <dt className="text-lg font-semibold tracking-[-0.03em] text-ink">
                    {service.title}
                  </dt>
                  <dd className="text-sm leading-6 text-ink-muted">
                    {service.shortDescription}
                  </dd>
                  <button
                    type="button"
                    onClick={() => setActiveService(service)}
                    className="inline-flex min-h-11 items-center justify-self-start font-mono text-xs text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Learn more
                  </button>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <ServiceDetailModal
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
