import type { CvData } from "@/types/cv";

type CvDocumentProps = {
  data: CvData;
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function SidebarHeading({ children }: { children: string }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600">
      {children}
    </h2>
  );
}

function MainHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.16em] text-slate-950">
      {children}
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-slate-200 print:bg-slate-300"
      />
    </h2>
  );
}

export function CvDocument({ data }: CvDocumentProps) {
  return (
    <article
      aria-label={`Curriculum vitae for ${data.name}`}
      className="
        mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl border
        border-slate-200 bg-white text-slate-800 shadow-xl
        print:max-w-none print:rounded-none print:border-0 print:shadow-none
      "
    >
      <header className="flex items-center gap-5 bg-slate-950 px-8 py-8 text-white print:bg-slate-950 print:px-10 sm:px-10">
        <div
          aria-hidden="true"
          className="flex size-16 shrink-0 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold tracking-tight text-white"
        >
          {initials(data.name)}
        </div>
        <div>
          <h1 className="font-serif text-3xl leading-none tracking-[-0.02em] sm:text-4xl">
            {data.name}
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-orange-300">
            {data.headline}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-y-8 px-8 py-8 sm:px-10 md:grid-cols-[240px_1fr] md:gap-x-10 print:px-10 print:py-8">
        <aside className="flex flex-col gap-6 md:border-r md:border-slate-100 md:pr-8 print:md:border-slate-200">
          <section>
            <SidebarHeading>Contact</SidebarHeading>
            <ul className="mt-3 flex flex-col gap-2.5">
              {data.contacts.map((contact) => (
                <li key={contact.label} className="text-[13px] leading-snug">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {contact.label}
                  </span>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="break-words text-slate-700 underline-offset-2 hover:text-orange-600 hover:underline"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="break-words text-slate-700">
                      {contact.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {data.skills.map((group) => (
            <section key={group.title} className="break-inside-avoid">
              <SidebarHeading>{group.title}</SidebarHeading>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 print:border print:border-slate-200 print:bg-white"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {data.services.length > 0 ? (
            <section className="break-inside-avoid">
              <SidebarHeading>Services</SidebarHeading>
              <ul className="mt-3 flex flex-col gap-1.5">
                {data.services.map((service) => (
                  <li
                    key={service.title}
                    className="flex items-start gap-2 text-[12px] leading-snug text-slate-700"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-orange-500"
                    />
                    {service.title}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>

        <main className="flex flex-col gap-7">
          <section>
            <MainHeading>Profile</MainHeading>
            <p className="text-[13px] leading-6 text-slate-600">
              {data.summary}
            </p>
            {data.availability ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800 print:border print:border-emerald-200">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-emerald-500"
                />
                {data.availability}
              </p>
            ) : null}
          </section>

          <section>
            <MainHeading>Experience</MainHeading>
            <div className="flex flex-col gap-5">
              {data.experience.map((item) => (
                <div key={item.slug} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[15px] font-semibold text-slate-950">
                      {item.role}
                      <span className="font-normal text-slate-400"> · </span>
                      <span className="font-medium text-orange-600">
                        {item.title}
                      </span>
                    </h3>
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
                      {item.period}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[12px] font-medium text-slate-500">
                    {item.company} · {item.category}
                  </p>

                  <p className="mt-2 text-[12.5px] leading-6 text-slate-600">
                    {item.description}
                  </p>

                  {item.highlights.length > 0 ? (
                    <ul className="mt-2 flex flex-col gap-1">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-[12px] leading-snug text-slate-600"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[7px] size-1 shrink-0 rounded-full bg-orange-400"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.tech.length > 0 ? (
                    <p className="mt-2 text-[11px] leading-snug text-slate-500">
                      <span className="font-semibold text-slate-600">
                        Stack:{" "}
                      </span>
                      {item.tech.join(", ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </article>
  );
}
