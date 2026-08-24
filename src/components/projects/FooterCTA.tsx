import Link from "next/link";

import { CloseCta } from "@/components/shared/CloseCta";

export function FooterCTA() {
  return (
    <div>
      <CloseCta />
      <div className="bg-paper px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <Link
            href="/#projects"
            className="font-mono text-sm text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            View more projects
          </Link>
        </div>
      </div>
    </div>
  );
}
