import {
  Accessibility,
  ChartColumn,
  FileCheck,
  FolderTree,
  Folders,
  Gauge,
  Globe,
  Image as ImageIcon,
  Layout,
  LayoutDashboard,
  ListChecks,
  Lock,
  Shield,
  Smartphone,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectFeature } from "@/types/project";

const iconMap: Record<string, LucideIcon> = {
  layout: Layout,
  image: ImageIcon,
  smartphone: Smartphone,
  zap: Zap,
  sitemap: FolderTree,
  accessibility: Accessibility,
  globe: Globe,
  gauge: Gauge,
  "list-checks": ListChecks,
  "layout-dashboard": LayoutDashboard,
  users: Users,
  shield: Shield,
  "chart-column": ChartColumn,
  folders: Folders,
  "file-check": FileCheck,
  lock: Lock,
};

type FeaturesProps = {
  features: ProjectFeature[];
};

export function Features({ features }: FeaturesProps) {
  return (
    <SectionShell tone="muted">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Capabilities
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Key Features
        </h2>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = iconMap[feature.iconName] ?? Layout;

          return (
            <article
              key={feature.title}
              className="border-t border-rule py-6"
            >
              <div className="flex size-11 items-center justify-center border border-rule bg-paper text-ink">
                <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-ink-muted">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
