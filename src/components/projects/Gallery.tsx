import Image from "next/image";

import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectGalleryItem } from "@/types/project";

type GalleryProps = {
  items: ProjectGalleryItem[];
  title: string;
};

export function Gallery({ items, title }: GalleryProps) {
  const rows: ProjectGalleryItem[][] = [];
  let index = 0;

  while (index < items.length) {
    const current = items[index];
    if (!current) {
      break;
    }

    if (current.layout === "large") {
      rows.push([current]);
      index += 1;
      continue;
    }

    const next = items[index + 1];
    if (next && next.layout === "small") {
      rows.push([current, next]);
      index += 2;
    } else {
      rows.push([current]);
      index += 1;
    }
  }

  return (
    <SectionShell tone="white">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Visuals
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Screenshots
        </h2>
      </div>

      <div className="mt-12 space-y-6">
        {rows.map((row) => {
          if (row.length === 1 && row[0]) {
            const item = row[0];
            return (
              <figure key={item.imagePath} className="group">
                <div className="relative aspect-video overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
                  <Image
                    src={item.imagePath}
                    alt={`${title} — ${item.caption}`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="mt-4 text-sm text-slate-600">
                  {item.caption}
                </figcaption>
              </figure>
            );
          }

          return (
            <div
              key={row.map((item) => item.imagePath).join("-")}
              className="grid gap-6 md:grid-cols-2"
            >
              {row.map((item) => (
                <figure key={item.imagePath} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
                    <Image
                      src={item.imagePath}
                      alt={`${title} — ${item.caption}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="mt-4 text-sm text-slate-600">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
