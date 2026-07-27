This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

## Database

Seed the local SQLite database before running the app:

```bash
npm run seed
```

This creates `data/portfolio.db` (gitignored) from `scripts/seed-db.ts`.

For build and deploy, run `npm run seed` before `npm run build` so the SQLite database exists at build time.

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Netlify

This project is configured for Netlify via `netlify.toml` and `@netlify/plugin-nextjs`.

1. Connect the repo in the Netlify dashboard (or use the Netlify CLI).
2. Build command is already set: `npm run seed && npm run build`.
3. After the first successful deploy, open **Forms** in the Netlify UI — the `contact` form should appear (registered from `public/__forms.html`).
4. Enable form email notifications to your inbox (e.g. `jessy.prananda@gmail.com`) under Forms → Form notifications.

### Contact form notes

- Production / `netlify dev`: submissions go to Netlify Forms.
- Plain `npm run dev`: Netlify Forms will not receive messages (expect a failed submit unless you use Netlify Dev).

## Deploy on Vercel

You can also deploy with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), but contact delivery in this repo is wired for **Netlify Forms**, not Vercel.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
