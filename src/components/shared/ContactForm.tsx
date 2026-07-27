"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setInfoMessage(null);
      setErrorMessage("Please fill in your name, email, and message.");
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
      setInfoMessage("Thanks — your message was sent.");
    } catch {
      setErrorMessage(
        "Something went wrong sending your message. Please try again, or email me directly.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      name="contact"
      onSubmit={handleSubmit}
      className="mt-10 space-y-6"
      noValidate
    >
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
          value={form.name}
          disabled={pending}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
        />
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
          value={form.email}
          disabled={pending}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-800"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          disabled={pending}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
        />
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
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
