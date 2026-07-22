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

export function ServicesSection({
  services,
}: ServicesSectionProps) {
  const [activeService, setActiveService] =
    useState<Service | null>(null);

  return (
    <>
      <section
        id="services"
        aria-labelledby="services-title"
        className="scroll-mt-24 border-y border-slate-200 bg-slate-50/70 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                What I build
              </p>

              <h2
                id="services-title"
                className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] text-slate-950 sm:text-6xl"
              >
                Products
                <br />
                I create
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              I work across different platforms to build products that are
              practical, scalable, and focused on real user needs.
            </p>
          </header>

          {services.length === 0 ? (
            <p className="mt-12 border-y border-slate-200 py-10 text-sm text-slate-600">
              No services available yet.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => {
                const Icon =
                  iconMap[
                    service.iconName as keyof typeof iconMap
                  ] ?? AppWindow;

                return (
                  <article
                    key={service.slug}
                    className={[
                      "group flex min-h-[360px] flex-col border-b border-slate-200 py-8",
                      "sm:px-7",
                      index % 2 === 0 ? "sm:border-r" : "",
                      index > 0 ? "xl:border-l" : "",
                      "xl:border-r-0 xl:px-8",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-950 transition duration-300 group-hover:border-orange-500 group-hover:text-orange-600">
                        <Icon
                          className="size-6"
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </div>

                      <span className="font-mono text-xs text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-10 font-serif text-3xl tracking-[-0.035em] text-slate-950">
                      {service.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {service.shortDescription}
                    </p>

                    <div className="mt-auto pt-10">
                      <div className="mb-5 h-px bg-slate-200 transition group-hover:bg-orange-200" />

                      <button
                        type="button"
                        onClick={() => setActiveService(service)}
                        className="inline-flex min-h-11 w-full items-center justify-between gap-4 text-sm font-medium text-slate-950 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
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
              })}
            </div>
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
