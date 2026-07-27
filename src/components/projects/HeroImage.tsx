import Image from "next/image";

import { SectionShell } from "@/components/projects/SectionShell";

type HeroImageProps = {
  src: string;
  caption: string;
  title: string;
};

export function HeroImage({ src, caption, title }: HeroImageProps) {
  return (
    <SectionShell tone="white" tightTop>
      <figure>
        <div className="group relative aspect-video overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-sm">
          <Image
            src={src}
            alt={`${title} hero screenshot`}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            priority
          />
        </div>
        <figcaption className="mt-5 text-center text-sm leading-6 text-slate-600">
          {caption}
        </figcaption>
      </figure>
    </SectionShell>
  );
}
