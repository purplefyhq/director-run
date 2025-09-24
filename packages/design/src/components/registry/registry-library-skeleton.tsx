"use client";

import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { LayoutView, LayoutViewContent } from "../layout/layout";
import { LayoutBreadcrumbHeader } from "../layout/layout-breadcrumb-header";
import { ListOfLinks } from "../list-of-links";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "../ui/section";

export function RegistryLibrarySkeleton({
  children,
}: { children?: ReactNode }) {
  return (
    <LayoutView className="pointer-events-none relative select-none">
      {children}
      <LayoutBreadcrumbHeader
        breadcrumbs={[
          {
            title: "Loading proxy…",
          },
        ]}
        loading={true}
      >
        <Button
          size="icon"
          variant="ghost"
          className="radix-state-[open]:bg-accent-subtle"
          disabled
        >
          <DotsThreeOutlineVerticalIcon weight="fill" className="!size-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </LayoutBreadcrumbHeader>
      <LayoutViewContent aria-hidden>
        <Container size="lg">
          <Section className="gap-y-6">
            <SectionHeader>
              <SectionTitle>Discover MCP servers</SectionTitle>
              <SectionDescription>
                Find MCP servers for your favourite tools and install them
                directly to your Director proxies.
              </SectionDescription>
            </SectionHeader>

            <ListOfLinks isLoading={true} links={[]} />
          </Section>
        </Container>
      </LayoutViewContent>
    </LayoutView>
  );
}
