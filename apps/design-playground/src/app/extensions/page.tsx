import { ExtensionCard } from "@/components/extensions/extensions-card";
import { Button } from "@workingco/design/components/button";
import { Pill } from "@workingco/design/components/pill";
import { SectionActions, SectionHeader, SectionTitle } from "@workingco/design/components/section";
import { Section } from "@workingco/design/components/section";
import { PlusIcon } from "@workingco/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extensions",
};

export default function ExtensionsPage() {
  return (
    <div className="flex min-h-full flex-col gap-y-20 p-8 md:p-16">
      <Section>
        <SectionHeader>
          <SectionTitle>Extensions</SectionTitle>
          <Pill variant="secondary" size="sm" className="tabular-nums">
            12
          </Pill>

          <SectionActions>
            <Button variant="secondary" size="icon">
              <span className="sr-only">Install extension</span>
              <PlusIcon aria-hidden />
            </Button>
          </SectionActions>
        </SectionHeader>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {new Array(12).fill(null).map((_, index) => (
            <ExtensionCard key={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}
