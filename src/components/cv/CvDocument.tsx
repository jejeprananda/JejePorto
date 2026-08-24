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
    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
      {children}
    </h2>
  );
}

function MainHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.16em] text-ink">
      {children}
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-rule print:bg-rule"
      />
    </h2>
  );
}

export function CvDocument({ data }: CvDocumentProps) {
  return (
    <article
      aria-label={`Curriculum vitae for ${data.name}`}
      className="
        mx-auto w-full max-w-[900px] overflow-hidden border
        border-rule bg-white text-ink
        print:max-w-none print:border-0
      "
    >
      <header className="flex items-center gap-4 bg-ink px-5 py-6 text-white print:bg-ink print:px-10 sm:gap-5 sm:px-10 sm:py-8">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center bg-accent text-xl font-bold tracking-tight text-white sm:size-16 sm:text-2xl"
        >
          {initials(data.name)}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] [overflow-wrap:anywhere] sm:text-4xl">
            {data.name}
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70 sm:text-xs sm:tracking-[0.18em]">
            {data.headline}
          </p>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-y-8 px-5 py-6 sm:px-10 sm:py-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-10 print:px-10 print:py-8">
        <aside className="flex flex-col gap-6 md:border-r md:border-rule md:pr-8 print:md:border-rule">
          <section>
            <SidebarHeading>Contact</SidebarHeading>
            <ul className="mt-3 flex flex-col gap-2.5">
              {data.contacts.map((contact) => (
                <li key={contact.label} className="text-[13px] leading-snug">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {contact.label}
                  </span>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="break-words text-ink underline-offset-2 hover:text-accent hover:underline"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="break-words text-ink">
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
                    className="border border-rule px-2 py-1 text-[11px] font-medium text-ink print:bg-white"
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
                    className="flex items-start gap-2 text-[12px] leading-snug text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
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
            <p className="text-[13px] leading-6 text-ink-muted">
              {data.summary}
            </p>
            {data.availability ? (
              <p className="mt-3 inline-flex items-center gap-1.5 border border-rule px-3 py-1 font-mono text-[11px] text-accent print:border-rule">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-accent"
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
                    <h3 className="text-[15px] font-semibold text-ink">
                      {item.role}
                      <span className="font-normal text-ink-muted"> · </span>
                      <span className="font-medium text-accent">
                        {item.title}
                      </span>
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                      {item.period}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[12px] font-medium text-ink-muted">
                    {item.company} · {item.category}
                  </p>

                  <p className="mt-2 text-[12.5px] leading-6 text-ink-muted">
                    {item.description}
                  </p>

                  {item.highlights.length > 0 ? (
                    <ul className="mt-2 flex flex-col gap-1">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-[12px] leading-snug text-ink-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[7px] size-1 shrink-0 rounded-full bg-accent"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.tech.length > 0 ? (
                    <p className="mt-2 text-[11px] leading-snug text-ink-muted">
                      <span className="font-semibold text-ink">
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
