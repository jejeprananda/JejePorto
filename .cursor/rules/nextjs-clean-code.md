---
description: Enforce clean, consistent, maintainable, and production-ready code standards for Next.js
alwaysApply: true
---

# Next.js Clean Code Standards

You are working on a Next.js application using:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Root-level `app/` directory
- No `src/` directory

Always follow the clean-code and code-structure standards below.

---

## 1. General principles

All generated and modified code must be:

- Readable
- Predictable
- Maintainable
- Type-safe
- Accessible
- Responsive
- Easy to test
- Easy to refactor
- Consistent with the existing project
- Free from unnecessary abstractions

Prefer simple and explicit code over clever code.

Write code for future maintainers, not only for the current task.

Do not over-engineer small features.

Do not create abstractions before they are needed.

Follow this priority:

```text
Correctness
→ Readability
→ Maintainability
→ Performance
→ Brevity
```

Do not sacrifice readability merely to reduce the number of lines.

---

## 2. Project structure

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
│   ├── api/
│   └── [routes]/
│
├── components/
│   ├── layout/
│   ├── sections/
│   ├── shared/
│   └── ui/
│
├── config/
├── data/
├── hooks/
├── lib/
├── services/
├── types/
├── public/
└── middleware.ts
```

Do not create a `src/` directory unless explicitly requested.

Folder responsibilities:

```text
app/
→ Routing, pages, layouts, route handlers, loading, and error boundaries

components/ui/
→ Generic reusable UI primitives

components/layout/
→ Navbar, footer, container, sidebar, and structural components

components/sections/
→ Large page sections

components/shared/
→ Application-specific components reused in multiple places

hooks/
→ Reusable React hooks

lib/
→ Utilities, framework helpers, validation, and shared infrastructure

services/
→ External API communication and domain-oriented server operations

data/
→ Static application data

config/
→ Application configuration

types/
→ Shared TypeScript types and domain models

public/
→ Static assets
```

Do not place reusable components, utilities, hooks, or static data directly inside `app/`.

---

## 3. File responsibility

Each file must have one clear responsibility.

Avoid files that contain unrelated:

- Components
- Types
- Constants
- API calls
- Utility functions
- Business logic

A file should be understandable from its name.

Avoid generic filenames:

```text
Helper.ts
Utils.ts
Data.ts
Common.ts
Component.tsx
NewComponent.tsx
Misc.ts
```

Prefer specific names:

```text
formatCurrency.ts
validateContactForm.ts
ProjectCard.tsx
navigation.ts
siteConfig.ts
```

Split a file when it:

- Handles multiple responsibilities
- Contains several unrelated components
- Becomes difficult to navigate
- Contains deeply nested JSX
- Mixes UI, data fetching, validation, and formatting
- Requires many unrelated imports

Do not split files merely because they exceed an arbitrary line count.

Split based on responsibility and readability.

---

## 4. Page structure

A `page.tsx` file should primarily:

- Define page metadata
- Fetch page-level data
- Compose sections or feature components
- Handle route parameters
- Handle search parameters

Keep page files small and declarative.

Preferred:

```tsx
import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { WorksSection } from "@/components/sections/WorksSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <WorksSection />
    </main>
  );
}
```

Avoid:

```tsx
export default function HomePage() {
  return (
    <main>
      {/* Hundreds of lines of implementation */}
    </main>
  );
}
```

Do not place large static datasets, reusable helpers, or complex business logic inside `page.tsx`.

---

## 5. Layout structure

Use `layout.tsx` for UI shared by child routes.

The root layout may contain:

- `<html>`
- `<body>`
- Global fonts
- Global metadata
- Navbar
- Footer
- Theme providers
- Application-wide providers

Do not place page-specific sections inside the root layout.

Preferred:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jessy Prananda",
    template: "%s | Jessy Prananda",
  },
  description: "Portfolio of Jessy Prananda, Fullstack Designer.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

---

## 6. Component design

Each component should have one primary responsibility.

A component should preferably:

- Have a clear name
- Receive explicit props
- Avoid hidden side effects
- Avoid unnecessary state
- Avoid unnecessary context
- Avoid excessive conditional rendering
- Be easy to reuse or replace

Prefer composition over large configuration-heavy components.

Preferred:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

Avoid creating one component with dozens of props controlling unrelated behavior.

Bad:

```tsx
<Section
  showImage
  darkMode
  isHero
  isCompact
  hasVideo
  showSocials
  useLargeTitle
  reverseOnMobile
/>
```

Create separate focused variants or compose smaller components instead.

---

## 7. Component size

Split a component when it has:

- Several meaningful visual areas
- Complex conditional branches
- Multiple interactive states
- Several unrelated event handlers
- Data transformation mixed with presentation
- A reusable child section
- A separate client-side responsibility

Example:

```text
components/sections/HeroSection/
├── HeroSection.tsx
├── HeroContent.tsx
├── HeroMedia.tsx
├── HeroActions.tsx
├── HeroSocialLinks.tsx
└── index.ts
```

Do not extract trivial JSX into separate components without a clear benefit.

Avoid components that merely wrap one element and add no meaningful abstraction.

---

## 8. Component naming

Use PascalCase for React components:

```text
HeroSection.tsx
ProjectCard.tsx
MobileNavigation.tsx
ContactForm.tsx
```

Use names that describe purpose, not appearance alone.

Prefer:

```text
ProjectCard
ContactForm
NavigationMenu
ProfileSummary
```

Avoid:

```text
BlueBox
LeftSection
BigButton
SecondCard
ComponentOne
```

Use suffixes consistently:

```text
Page
Layout
Section
Card
Form
Modal
Dialog
Menu
List
Item
Provider
Skeleton
```

---

## 9. Function naming

Functions must use verbs that describe their behavior.

Preferred:

```ts
getProjects()
createContactMessage()
formatProjectDate()
validateEmailAddress()
handleFormSubmit()
```

Avoid vague names:

```ts
process()
execute()
doThing()
handleData()
run()
```

Use these conventions:

```text
get...
→ Retrieve data

create...
→ Create a new resource

update...
→ Update an existing resource

delete...
→ Delete a resource

format...
→ Convert a value into display format

parse...
→ Convert input into another structure

validate...
→ Validate input

is..., has..., can..., should...
→ Return a boolean

handle...
→ React event handler
```

---

## 10. Variable naming

Use descriptive names.

Preferred:

```ts
const activeProjectIndex = 0;
const isNavigationOpen = false;
const formattedPublishedDate = "";
```

Avoid:

```ts
const x = 0;
const temp = false;
const data2 = "";
```

Short variable names are acceptable only for small and obvious scopes:

```ts
projects.map((project) => ...)
items.filter((item) => ...)
```

Boolean names should use:

```text
is
has
can
should
was
did
```

Examples:

```ts
isLoading
hasError
canSubmit
shouldAnimate
isAuthenticated
```

Avoid negative boolean names when possible.

Prefer:

```ts
isEnabled
```

Instead of:

```ts
isNotDisabled
```

---

## 11. TypeScript standards

Use TypeScript for all source code.

Do not use `any` unless absolutely unavoidable.

Prefer:

- Explicit domain types
- Inferred local types
- Generics
- `unknown`
- Type guards
- Discriminated unions

Bad:

```ts
function parseResponse(data: any) {
  return data.value;
}
```

Preferred:

```ts
type ApiResponse = {
  value: string;
};

function parseResponse(data: ApiResponse) {
  return data.value;
}
```

When input is truly unknown:

```ts
function isApiResponse(value: unknown): value is ApiResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof value.value === "string"
  );
}
```

Do not disable TypeScript errors merely to make the build pass.

Avoid:

```ts
// @ts-ignore
```

Use `@ts-expect-error` only when there is a documented and intentional reason.

---

## 12. Type placement

Keep component-only props near the component:

```tsx
type ProjectCardProps = {
  title: string;
  description: string;
};

export function ProjectCard({
  title,
  description,
}: ProjectCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
```

Move types into `types/` when they:

- Are shared across multiple files
- Represent a domain model
- Represent an API contract
- Are reused by components and services

Example:

```ts
export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
};
```

Do not create a global type file containing every type in the application.

Prefer domain-specific files:

```text
types/project.ts
types/navigation.ts
types/contact.ts
types/api.ts
```

---

## 13. Prefer type over interface by default

Use `type` by default for:

- Component props
- Unions
- Tuples
- Function signatures
- Domain models

Example:

```ts
type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
};
```

Use `interface` when:

- Declaration merging is intentionally required
- Extending an object-oriented public contract is clearer
- Existing project conventions use interfaces consistently

Do not mix `type` and `interface` arbitrarily.

---

## 14. Avoid duplicated types

Do not redefine the same data shape across multiple files.

Bad:

```ts
type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
};
```

And elsewhere:

```ts
type ProjectItem = {
  id: string;
  title: string;
  description: string;
};
```

Create and reuse a shared domain type instead.

Use utility types when appropriate:

```ts
type ProjectPreview = Pick<
  Project,
  "slug" | "title" | "description" | "image"
>;
```

---

## 15. Server Components by default

All components are Server Components by default.

Do not add `"use client"` unless the component requires:

- React state
- React effects
- Event handlers
- Browser APIs
- Client-only hooks
- Client-side context
- Client animation libraries

Preferred architecture:

```tsx
import { HeroContent } from "./HeroContent";
import { HeroMedia } from "./HeroMedia";

export function HeroSection() {
  return (
    <section>
      <HeroContent />
      <HeroMedia />
    </section>
  );
}
```

Only the interactive child should be a Client Component:

```tsx
"use client";

import { motion } from "framer-motion";

export function HeroMedia() {
  return <motion.div />;
}
```

Do not add `"use client"` to:

- Root layouts
- Entire pages
- Large sections

merely because one nested button requires interaction.

Keep client boundaries as small as practical.

---

## 16. Client Component rules

Client Components should not directly perform sensitive server operations.

Do not expose:

- Database credentials
- Private API keys
- Server tokens
- Internal environment variables
- Private service configuration

Client Components should communicate with the server through:

- Server Actions
- Route Handlers
- Approved public APIs

Avoid unnecessary `useEffect`.

Do not use `useEffect` to derive values that can be calculated during render.

Bad:

```tsx
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Preferred:

```tsx
const fullName = `${firstName} ${lastName}`;
```

---

## 17. State management

Keep state as local as possible.

Use this order:

```text
Derived value
→ Local component state
→ Shared parent state
→ Context
→ External state library
```

Do not introduce global state for values used by only one component.

Do not store values in state when they can be derived from props or other state.

Bad:

```tsx
const [filteredProjects, setFilteredProjects] = useState(projects);
```

Preferred:

```tsx
const filteredProjects = projects.filter((project) =>
  project.title.toLowerCase().includes(query.toLowerCase()),
);
```

Use external state libraries only when the application complexity justifies them.

---

## 18. Props design

Props should be:

- Minimal
- Explicit
- Predictable
- Properly typed

Avoid passing entire objects when only one or two values are needed, unless the object represents a meaningful domain entity.

Avoid excessive prop drilling.

Do not solve all prop drilling with context automatically.

Use composition when practical.

Preferred:

```tsx
<Modal trigger={<OpenModalButton />}>
  <ProjectDetails />
</Modal>
```

Avoid ambiguous props:

```tsx
<Component data={data} config={config} options={options} />
```

Prefer meaningful domain names:

```tsx
<ProjectCard project={project} />
```

---

## 19. Default values

Use default parameter values instead of manually checking `undefined`.

Preferred:

```tsx
type SectionProps = {
  className?: string;
  isCentered?: boolean;
};

export function Section({
  className = "",
  isCentered = false,
}: SectionProps) {
  // ...
}
```

Avoid unclear fallback chains.

Use nullish coalescing when `0`, `false`, or an empty string are valid values:

```ts
const pageSize = inputPageSize ?? 10;
```

Do not use `||` when valid falsy values must be preserved.

---

## 20. Conditional rendering

Keep conditional rendering readable.

Preferred:

```tsx
if (isLoading) {
  return <ProjectListSkeleton />;
}

if (error) {
  return <ProjectListError />;
}

if (projects.length === 0) {
  return <EmptyProjectList />;
}

return <ProjectList projects={projects} />;
```

Avoid deeply nested ternaries:

```tsx
return isLoading
  ? <Loading />
  : error
    ? <Error />
    : projects.length
      ? <List />
      : <Empty />;
```

A simple ternary is acceptable:

```tsx
{isOpen ? <CloseIcon /> : <MenuIcon />}
```

Use early returns to reduce nesting.

---

## 21. Avoid deeply nested code

Avoid deep nesting in:

- JSX
- Functions
- Conditionals
- Loops
- Promise chains

Use early returns.

Bad:

```ts
function submitForm() {
  if (user) {
    if (user.isActive) {
      if (formIsValid) {
        // Submit
      }
    }
  }
}
```

Preferred:

```ts
function submitForm() {
  if (!user) return;
  if (!user.isActive) return;
  if (!formIsValid) return;

  // Submit
}
```

---

## 22. Avoid magic values

Do not scatter unexplained values throughout the code.

Bad:

```ts
if (projects.length > 6) {
  // ...
}
```

Preferred:

```ts
const MAX_FEATURED_PROJECTS = 6;

if (projects.length > MAX_FEATURED_PROJECTS) {
  // ...
}
```

Place constants:

- Near the component when locally relevant
- In a feature-specific constants file when shared within a feature
- In `config/` when they represent application configuration
- In `lib/` only when they are infrastructure-related

Do not create a global constants file containing unrelated values.

---

## 23. Function design

Functions should:

- Do one thing
- Have clear inputs
- Return predictable outputs
- Avoid hidden mutations
- Avoid excessive parameters
- Avoid side effects when possible

Prefer pure functions for transformations.

Bad:

```ts
function prepareProject(project: Project) {
  project.title = project.title.trim();
  project.technologies.sort();

  return project;
}
```

Preferred:

```ts
function prepareProject(project: Project): Project {
  return {
    ...project,
    title: project.title.trim(),
    technologies: [...project.technologies].sort(),
  };
}
```

Avoid functions with many positional parameters.

Bad:

```ts
createProject(title, slug, description, image, tags, url, featured);
```

Preferred:

```ts
type CreateProjectInput = {
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  url?: string;
  isFeatured?: boolean;
};

createProject(input);
```

---

## 24. Error handling

Handle expected errors explicitly.

Do not silently swallow errors.

Bad:

```ts
try {
  await submitForm();
} catch {}
```

Preferred:

```ts
try {
  await submitForm();
} catch (error) {
  console.error("Failed to submit contact form", error);
  throw new Error("Unable to submit the contact form.");
}
```

User-facing errors must be:

- Clear
- Safe
- Non-technical
- Actionable when possible

Do not expose stack traces, credentials, database details, or internal service information.

Use specific error boundaries where appropriate.

Provide:

```text
loading.tsx
error.tsx
not-found.tsx
```

when a route requires them.

---

## 25. Async code

Use `async` and `await` for readability.

Preferred:

```ts
const response = await fetch(url);

if (!response.ok) {
  throw new Error("Failed to fetch projects.");
}

const projects = await response.json();
```

Avoid unnecessary promise wrappers.

Bad:

```ts
return new Promise(async (resolve, reject) => {
  // ...
});
```

Run independent promises concurrently:

```ts
const [projects, technologies] = await Promise.all([
  getProjects(),
  getTechnologies(),
]);
```

Do not use `Promise.all` for operations that depend on one another.

---

## 26. Data fetching

Fetch data as close as practical to where it is used.

Prefer Server Components for server-side fetching.

Example:

```tsx
export async function WorksSection() {
  const projects = await getFeaturedProjects();

  return <ProjectGrid projects={projects} />;
}
```

Do not fetch server data in a Client Component unless client-side refetching or live interaction is required.

Handle:

- Loading
- Errors
- Empty states
- Invalid data
- Timeouts where relevant

Do not duplicate the same request across multiple nested components.

---

## 27. Service layer

Use `services/` when external communication or domain operations become sufficiently complex.

Example:

```text
services/
├── projects/
│   ├── getProjects.ts
│   ├── getProjectBySlug.ts
│   └── createProject.ts
└── contact/
    └── sendContactMessage.ts
```

Service functions should not contain JSX.

Prefer domain-specific services over one generic API file.

Avoid:

```text
services/api.ts
```

containing every request in the project.

---

## 28. Route Handlers

Place Route Handlers under:

```text
app/api/[resource]/route.ts
```

Keep route handlers thin.

A route handler should:

1. Read the request
2. Validate input
3. Call a service
4. Return a response

Preferred:

```ts
import { NextResponse } from "next/server";

import { sendContactMessage } from "@/services/contact/sendContactMessage";
import { contactSchema } from "@/lib/validations/contactSchema";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Invalid contact form data.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  await sendContactMessage(result.data);

  return NextResponse.json(
    { message: "Message sent successfully." },
    { status: 201 },
  );
}
```

Do not place extensive business logic directly inside `route.ts`.

Return appropriate HTTP status codes.

---

## 29. Server Actions

Use Server Actions for mutations closely related to a form or server-rendered workflow.

Validate all Server Action input on the server.

Do not trust client-provided values.

A Server Action should:

- Validate input
- Check authorization when needed
- Call domain or service functions
- Return a typed result
- Revalidate or redirect when appropriate

Do not return sensitive internal error details.

Example result type:

```ts
type ContactActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};
```

---

## 30. Input validation

Validate every external input.

External input includes:

- Form data
- Request bodies
- URL parameters
- Search parameters
- Cookies
- Headers
- Environment variables
- External API responses

Do not assume TypeScript types validate runtime data.

Use an existing schema validation library when available.

Keep validation schemas separate from UI when reused.

Example:

```text
lib/validations/contactSchema.ts
```

---

## 31. Security

Never expose:

- API secrets
- Private tokens
- Database credentials
- Internal URLs
- Service account data
- Sensitive environment variables

Only variables prefixed with `NEXT_PUBLIC_` may be used in client code.

Do not prefix secrets with `NEXT_PUBLIC_`.

Validate authorization on the server.

Do not rely on hidden buttons or client checks for security.

Sanitize or safely render user-generated content.

Do not use `dangerouslySetInnerHTML` unless required and sanitized.

Do not log sensitive information.

---

## 32. Import organization

Use the `@/` alias for project imports.

Preferred:

```tsx
import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
```

Import order:

1. React and Next.js
2. Third-party libraries
3. Internal absolute imports
4. Relative imports
5. Styles

Separate groups with blank lines.

Use `import type` for type-only imports.

Avoid deeply nested relative imports:

```tsx
import { Button } from "../../../../components/ui/Button";
```

Do not keep unused imports.

Avoid importing entire libraries when only one function is required.

---

## 33. Export standards

Prefer named exports for reusable components and utilities.

```tsx
export function ProjectCard() {
  return <article />;
}
```

Use default exports for Next.js convention files:

```text
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
```

Do not use anonymous default exports.

Avoid:

```ts
export default function () {
  // ...
}
```

Use a descriptive function name.

---

## 34. Barrel files

Use `index.ts` only to define a small and intentional public API.

Example:

```ts
export { HeroSection } from "./HeroSection";
```

Do not create a global barrel file that exports the entire project.

Avoid circular dependencies.

Avoid importing from a barrel file within the same module folder when it may create a cycle.

---

## 35. Static data

Place static data outside UI components.

Use:

```text
data/projects.ts
data/services.ts
data/navigation.ts
data/technologies.ts
```

Preferred:

```ts
import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "portfolio",
    slug: "portfolio",
    title: "Personal Portfolio",
    description: "A modern portfolio built with Next.js.",
    image: "/images/projects/portfolio.webp",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];
```

Do not define large static arrays inside components.

Use `as const` when immutable literal values are intended.

---

## 36. Constants and configuration

Use `config/` for application-level settings.

Example:

```ts
export const siteConfig = {
  name: "Jessy Prananda",
  title: "Fullstack Designer",
  description:
    "I design and build polished, functional digital products.",
  url: "https://www.jessyprananda.my.id",
} as const;
```

Do not duplicate:

- Site name
- URLs
- Navigation links
- Social links
- Metadata descriptions
- Contact information

across multiple components.

---

## 37. Tailwind CSS standards

Use Tailwind CSS consistently.

Prefer mobile-first classes:

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
```

Avoid desktop-first overrides when mobile-first styling is clearer.

Keep class names readable.

Use a class utility for conditional merging:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Avoid unnecessary arbitrary values:

```text
w-[1173px]
mt-[37px]
text-[19px]
```

Prefer design-system values where possible:

```text
max-w-7xl
mt-10
text-lg
```

Arbitrary values are acceptable when required by a specific design.

Avoid large repeated class strings. Extract reusable components or class constants when repetition is meaningful.

Do not extract every Tailwind class into constants.

---

## 38. Responsive design

Every UI implementation must be responsive.

Test mentally and structurally for:

- Small mobile
- Standard mobile
- Tablet
- Laptop
- Large desktop

Avoid fixed dimensions that cause overflow.

Bad:

```tsx
<div className="w-[1200px]">
```

Preferred:

```tsx
<div className="w-full max-w-7xl">
```

Use responsive grids and flex layouts.

Use:

```text
min-h-dvh
```

when full viewport height must behave correctly on mobile browsers.

Prevent horizontal overflow.

Ensure images, video, code blocks, tables, and long text remain usable on mobile.

---

## 39. Accessibility

Use semantic HTML.

Preferred elements:

```text
header
nav
main
section
article
aside
footer
button
a
form
label
```

Use:

- Buttons for actions
- Links for navigation
- Labels for inputs
- Headings in logical order
- Accessible names for icon-only controls
- Visible keyboard focus states
- Meaningful image alt text

Example:

```tsx
<button
  type="button"
  aria-label="Open navigation menu"
  onClick={handleMenuToggle}
>
  <Menu aria-hidden="true" />
</button>
```

Do not use clickable `div` or `span` elements when semantic controls are available.

Decorative images should use:

```tsx
alt=""
```

Do not duplicate visible text in `aria-label` unnecessarily.

---

## 40. Image standards

Use `next/image` for content images whenever practical.

Example:

```tsx
<div className="relative aspect-[16/10] overflow-hidden">
  <Image
    src="/images/projects/dashboard.webp"
    alt="Dashboard project interface"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>
```

When using `fill`:

- The parent must have relative positioning
- The parent must have defined dimensions or an aspect ratio
- A correct `sizes` value should be provided

Use descriptive alt text.

Do not include words such as “image of” unless necessary.

Prefer WebP or AVIF for raster images.

---

## 41. Video standards

For decorative hero background video:

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/images/hero/hero-poster.webp"
  className="absolute inset-0 size-full object-cover"
  aria-hidden="true"
>
  <source
    src="/videos/hero-background.webm"
    type="video/webm"
  />
  <source
    src="/videos/hero-background.mp4"
    type="video/mp4"
  />
</video>
```

Background videos must:

- Be muted
- Be optimized
- Have a poster
- Not block page rendering
- Keep foreground text readable
- Respect reduced-motion preferences where practical
- Have no important information available only in video

Do not autoplay videos containing audio.

---

## 42. Forms

Every form field must have:

- A label
- A clear name
- Appropriate input type
- Validation
- Error messaging
- Accessible state

Example:

```tsx
<div>
  <label htmlFor="email">
    Email
  </label>

  <input
    id="email"
    name="email"
    type="email"
    autoComplete="email"
    aria-invalid={Boolean(error)}
    aria-describedby={error ? "email-error" : undefined}
  />

  {error ? (
    <p id="email-error" role="alert">
      {error}
    </p>
  ) : null}
</div>
```

Disable submit buttons while submitting.

Prevent duplicate submissions.

Do not rely only on placeholder text as a label.

Validate on the server even when client validation exists.

---

## 43. Comments

Write comments only when they explain:

- Why a decision exists
- A non-obvious constraint
- A workaround
- An external system limitation
- A security consideration

Avoid comments that merely restate code.

Bad:

```ts
// Set isOpen to true
setIsOpen(true);
```

Useful:

```ts
// Delay navigation until the exit animation finishes.
setTimeout(navigateToProject, EXIT_ANIMATION_DURATION);
```

Remove outdated comments when behavior changes.

Do not leave large blocks of commented-out code.

Use version control instead.

---

## 44. Logging

Do not leave unnecessary `console.log` statements in production code.

Allowed when meaningful:

```ts
console.error("Failed to load projects", error);
console.warn("Missing optional project thumbnail");
```

Do not log:

- Passwords
- Tokens
- Cookies
- Authorization headers
- Personal data
- Environment variables
- Complete request bodies containing sensitive data

Use structured logging when the project has a logging system.

---

## 45. Performance

Do not optimize blindly.

First avoid obvious problems:

- Large client bundles
- Unnecessary Client Components
- Unoptimized images
- Oversized background videos
- Repeated API requests
- Expensive calculations on every render
- Unnecessary dependencies
- Rendering very large lists without pagination

Use memoization only when there is a demonstrated or likely performance benefit.

Do not wrap every function in `useCallback`.

Do not wrap every derived value in `useMemo`.

Do not use `React.memo` automatically.

Prefer server rendering and static generation when suitable.

---

## 46. Dependency standards

Before installing a package:

1. Check existing dependencies
2. Determine whether the feature can be implemented cleanly without a package
3. Evaluate bundle size and maintenance cost
4. Confirm compatibility with the project

Do not install multiple packages that solve the same problem.

Do not introduce a package for trivial functionality.

Use the framework and browser platform before adding dependencies.

---

## 47. Avoid duplication

Do not duplicate:

- Components
- API calls
- Validation schemas
- Domain types
- Formatting logic
- Navigation data
- Site configuration
- Repeated UI patterns

Apply the Rule of Three:

```text
First occurrence
→ Implement directly

Second similar occurrence
→ Observe the pattern

Third occurrence
→ Consider abstraction
```

Do not force two superficially similar implementations into one abstraction when their responsibilities differ.

---

## 48. Avoid premature abstraction

Do not create:

- Generic repository layers
- Base components
- Universal form builders
- Highly configurable section components
- Complex dependency injection
- Generic service factories

unless the application actually requires them.

Prefer a focused implementation first.

Extract shared code after a real pattern appears.

---

## 49. Refactoring rules

When refactoring existing code:

- Preserve working behavior
- Preserve visual output unless redesign is requested
- Keep changes focused
- Update all affected imports
- Remove obsolete code
- Avoid unrelated formatting changes
- Reuse existing components
- Follow existing naming conventions
- Do not introduce a new architecture for one small change

Before moving a file, search for every reference to it.

When replacing code, remove the obsolete implementation.

Do not leave duplicate old and new implementations.

---

## 50. Code modification behavior

Before creating a new file:

1. Inspect existing related files
2. Check whether a reusable component already exists
3. Check existing naming and structure
4. Follow the current project conventions
5. Place the file in the correct folder

Before adding a utility:

1. Search for an existing equivalent
2. Check whether it is truly reusable
3. Give it a specific name
4. Add types
5. Avoid side effects

Before adding state:

1. Check whether the value can be derived
2. Check whether it can remain server-side
3. Keep it local when possible
4. Avoid global state without a real need

---

## 51. Forbidden patterns

Avoid the following unless explicitly justified:

```ts
any
```

```ts
// @ts-ignore
```

```tsx
<div onClick={...}>
```

```tsx
"use client";
```

on entire pages without necessity.

Avoid:

- Giant components
- Giant utility files
- Giant API files
- Deep relative imports
- Large static arrays inside components
- Nested ternary chains
- Silent catch blocks
- Unvalidated request data
- Direct secret exposure
- Random hard-coded values
- Duplicate types
- Duplicate API requests
- Unused code
- Commented-out code
- Excessive prop drilling
- Unnecessary global state
- Unnecessary `useEffect`
- Unnecessary memoization
- Anonymous default exports
- Misleading names
- Overly generic abstractions

---

## 52. Preferred component example

```tsx
import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({
  project,
  className,
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border bg-background",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-xl font-semibold">
            {project.title}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>

        <Link
          href={`/works/${project.slug}`}
          className="inline-flex items-center gap-2 font-medium"
        >
          View project
          <ArrowUpRight
            className="size-4"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
```

---

## 53. Preferred page example

```tsx
import type { Metadata } from "next";

import { ProjectGrid } from "@/components/shared/ProjectGrid";
import { getProjects } from "@/services/projects/getProjects";

export const metadata: Metadata = {
  title: "Works",
  description: "Selected projects by Jessy Prananda.",
};

export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Selected Works
        </h1>

        <p className="mt-5 text-lg text-muted-foreground">
          A collection of digital products, websites, and
          applications I have designed and developed.
        </p>
      </header>

      <section className="mt-12" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>

        <ProjectGrid projects={projects} />
      </section>
    </main>
  );
}
```

---

## 54. Completion checklist

Before completing any implementation, verify:

### Structure

- The project uses root-level `app/`
- Files are placed according to responsibility
- Pages primarily compose components
- Reusable code is outside `app/`
- No unnecessary folders or abstractions were introduced

### TypeScript

- No unjustified `any`
- Props and domain data are typed
- External input is validated
- Type-only imports use `import type`
- No TypeScript errors are suppressed unnecessarily

### Components

- Components have clear responsibilities
- Client boundaries are minimal
- State is local or derived when possible
- JSX is not deeply nested
- Conditional rendering is readable

### Next.js

- Server Components are used by default
- Metadata uses the Metadata API
- Images use `next/image` when appropriate
- Route Handlers are thin
- Sensitive operations remain server-side

### UI

- Layout is responsive
- Semantic HTML is used
- Keyboard interaction works
- Focus indicators remain visible
- Forms have accessible labels and errors
- Media does not reduce text readability

### Quality

- No unused imports
- No unused variables
- No unnecessary logs
- No commented-out code
- No duplicated implementation
- No unrelated changes
- Existing behavior is preserved
