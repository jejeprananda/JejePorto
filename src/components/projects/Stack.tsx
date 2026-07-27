import { SectionShell } from "@/components/projects/SectionShell";

type StackProps = {
  tech: string[];
};

export function Stack({ tech }: StackProps) {
  return (
    <SectionShell tone="white">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Tools
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Technology stack
        </h2>
      </div>

      <ul className="mt-12 flex flex-wrap gap-3">
        {tech.map((name) => (
          <li
            key={name}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-600"
          >
            {name}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
