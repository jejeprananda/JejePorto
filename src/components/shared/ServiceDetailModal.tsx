"use client";

import { useEffect } from "react";

import { X } from "lucide-react";

import type { Service } from "@/types/service";

type ServiceDetailModalProps = {
  service: Service | null;
  onClose: () => void;
};

export function ServiceDetailModal({
  service,
  onClose,
}: ServiceDetailModalProps) {
  useEffect(() => {
    if (!service) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
              Service
            </p>
            <h2
              id="service-modal-title"
              className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
            >
              {service.title}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close service details"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {service.detailDescription}
        </p>
      </div>
    </div>
  );
}
