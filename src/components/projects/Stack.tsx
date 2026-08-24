import { SectionShell } from "@/components/projects/SectionShell";

type StackProps = {
  tech: string[];
};

export function Stack({ tech }: StackProps) {
  return (
    <SectionShell tone="white">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Tools
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Technology stack
        </h2>
      </div>

      <ul className="mt-12 flex flex-wrap gap-3">
        {tech.map((name) => (
          <li
            key={name}
            className="font-mono text-sm text-ink"
          >
            {name}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
