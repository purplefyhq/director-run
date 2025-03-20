import { ExtensionCard } from "@/components/extensions/extensions-card";
import { Button } from "@workingco/design/components/button";
import { DescriptionDetail, DescriptionList, DescriptionTerm } from "@workingco/design/components/description-list";
import { Pill } from "@workingco/design/components/pill";
import { Section, SectionActions, SectionHeader, SectionTitle } from "@workingco/design/components/section";
import { HexagonIcon, PauseIcon, PlusIcon } from "@workingco/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <div className="flex min-h-full flex-col gap-y-20 p-8 md:p-16">
      <Section>
        <SectionHeader>
          <SectionTitle>My Helpful Server</SectionTitle>

          <SectionActions>
            <Pill variant="success">
              <HexagonIcon />
              <span>Running</span>
            </Pill>

            <Button variant="secondary" size="icon">
              <div className="sr-only">Pause server</div>
              <PauseIcon aria-hidden />
            </Button>
          </SectionActions>
        </SectionHeader>

        <DescriptionList>
          <DescriptionTerm>Address</DescriptionTerm>
          <DescriptionDetail>127.0.0.1:4141</DescriptionDetail>
          <DescriptionTerm>Resources</DescriptionTerm>
          <DescriptionDetail className="tabular-nums">4,800</DescriptionDetail>
          <DescriptionTerm>Tools</DescriptionTerm>
          <DescriptionDetail className="tabular-nums">129</DescriptionDetail>
          <DescriptionTerm>Prompts</DescriptionTerm>
          <DescriptionDetail className="tabular-nums">12,321,129</DescriptionDetail>
        </DescriptionList>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Extensions</SectionTitle>
          <Pill variant="secondary" size="sm" className="tabular-nums">
            12
          </Pill>

          <SectionActions>
            <Button variant="secondary" size="icon">
              <div className="sr-only">Install extension</div>
              <PlusIcon aria-hidden />
            </Button>
          </SectionActions>
        </SectionHeader>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {new Array(4).fill(null).map((_, index) => (
            <ExtensionCard key={index} />
          ))}
        </div>
        <Button variant="secondary" className="self-center" asChild>
          <Link href="/extensions">View all</Link>
        </Button>
      </Section>
    </div>
  );
}
