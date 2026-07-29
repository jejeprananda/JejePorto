"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { contactConfig } from "@/config/contact";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Please enter a valid email.";
  }

  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validate(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setInfoMessage(null);
      setErrorMessage(null);
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setPending(true);

    const body = new URLSearchParams({
      "form-name": "contact",
      "bot-field": "",
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }).toString();

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setForm(initialState);
      setFieldErrors({});
      setInfoMessage("Thanks — your message was sent.");
    } catch {
      const mailto = new URL(`mailto:${contactConfig.email}`);
      mailto.searchParams.set("subject", `Message from ${form.name.trim()}`);
      mailto.searchParams.set(
        "body",
        `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`,
      );
      window.location.href = mailto.toString();
      setErrorMessage(
        "Automatic send failed. Opening your email client as a fallback…",
      );
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60";

  return (
    <form name="contact" onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
      <p className="sr-only" aria-hidden="true">
        <label htmlFor="bot-field">Don’t fill this out</label>
        <input
          id="bot-field"
          name="bot-field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </p>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-800">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          value={form.name}
          disabled={pending}
          onChange={(event) => {
            setForm((current) => ({ ...current, name: event.target.value }));
            if (fieldErrors.name) {
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }
          }}
          className={inputClass}
        />
        {fieldErrors.name ? (
          <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          value={form.email}
          disabled={pending}
          onChange={(event) => {
            setForm((current) => ({ ...current, email: event.target.value }));
            if (fieldErrors.email) {
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }
          }}
          className={inputClass}
        />
        {fieldErrors.email ? (
          <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-800">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          value={form.message}
          disabled={pending}
          onChange={(event) => {
            setForm((current) => ({ ...current, message: event.target.value }));
            if (fieldErrors.message) {
              setFieldErrors((current) => ({ ...current, message: undefined }));
            }
          }}
          className={`${inputClass} resize-none`}
        />
        {fieldErrors.message ? (
          <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      {infoMessage ? (
        <p role="status" className="text-sm text-slate-600">
          {infoMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="
          inline-flex h-10 w-full items-center justify-center
          rounded-lg border border-slate-900/20 bg-white
          text-sm font-medium text-slate-950
          transition hover:border-orange-500 hover:text-orange-600
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-orange-500 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
