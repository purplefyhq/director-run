import { DescriptionDetail, DescriptionTerm } from "@workingco/design/components/description-list";
import { DescriptionList } from "@workingco/design/components/description-list";
import { SectionHeader, SectionTitle } from "@workingco/design/components/section";
import { Section } from "@workingco/design/components/section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Settings() {
  return (
    <div className="flex min-h-full flex-col gap-y-20 p-8 md:p-16">
      <Section>
        <SectionHeader>
          <SectionTitle>Server</SectionTitle>
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
    </div>
  );
}
