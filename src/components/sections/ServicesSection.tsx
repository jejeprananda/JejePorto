"use client";

import { useState } from "react";

import {
  AppWindow,
  ArrowRight,
  Globe,
  Smartphone,
  Terminal,
} from "lucide-react";

import { ServiceDetailModal } from "@/components/shared/ServiceDetailModal";
import type { Service } from "@/types/service";

const iconMap = {
  "app-window": AppWindow,
  globe: Globe,
  smartphone: Smartphone,
  terminal: Terminal,
} as const;

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
        className="scroll-mt-24 border-y border-slate-200 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
            <header className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                What I build
              </p>
              <h2
                id="services-title"
                className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.045em] text-slate-950 sm:text-6xl"
              >
                Products
                <br />
                I Create
              </h2>
              <p className="mt-7 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                I build digital products across platforms that are useful,
                scalable, and made to solve real problems.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.length === 0 ? (
                <p className="text-sm text-slate-600">No services available yet.</p>
              ) : (
                services.map((service) => {
                  const Icon =
                    iconMap[service.iconName as keyof typeof iconMap] ?? AppWindow;

                  return (
                    <article
                      key={service.slug}
                      className="group flex min-h-[320px] flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7"
                    >
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                        <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {service.shortDescription}
                      </p>
                      <div className="mt-auto pt-8">
                        <div className="mb-5 h-px bg-slate-200 transition-colors duration-300 group-hover:bg-orange-200" />
                        <button
                          type="button"
                          onClick={() => setActiveService(service)}
                          className="inline-flex min-h-11 w-full items-center justify-between gap-4 rounded-lg text-sm font-medium text-slate-950 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
                        >
                          <span>Learn more</span>
                          <ArrowRight
                            className="size-5 text-orange-600 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <ServiceDetailModal
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
