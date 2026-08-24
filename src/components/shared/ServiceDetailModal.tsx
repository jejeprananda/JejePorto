"use client";

import { useEffect, useRef } from "react";

import { X } from "lucide-react";

import type { Service } from "@/types/service";

type ServiceDetailModalProps = {
  service: Service | null;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function ServiceDetailModal({
  service,
  onClose,
}: ServiceDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!service) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = getFocusableElements(dialogRef.current);
        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [service, onClose]);

  if (!service) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-description"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto border border-rule bg-paper p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-h-[85dvh] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Service
            </p>
            <h2
              id="service-modal-title"
              className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink"
            >
              {service.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close service details"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center border border-rule text-ink transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p
          id="service-modal-description"
          className="mt-6 text-sm leading-7 text-ink-muted sm:text-base sm:leading-8"
        >
          {service.detailDescription}
        </p>
      </div>
    </div>
  );
}
