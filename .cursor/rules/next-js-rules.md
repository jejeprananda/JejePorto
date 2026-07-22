---
description: Enforce a clean and scalable Next.js App Router project structure
alwaysApply: true
---

# Next.js Project Structure Rules

You are working on a Next.js project using:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Root-level `app/` directory
- No `src/` directory

Always follow the project structure and coding rules below.

## 1. General project structure

Use this default structure:

```text
project-root/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── works/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   └── api/
│       └── contact/
│           └── route.ts
│
├── components/
│   ├── layout/
│   ├── sections/
│   ├── shared/
│   └── ui/
│
├── data/
├── hooks/
├── lib/
├── types/
├── config/
├── public/
│   ├── images/
│   ├── videos/
│   ├── icons/
│   └── fonts/
│
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
