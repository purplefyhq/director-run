"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutView,
  LayoutViewContent,
} from "../../../../../components/layout/layout";
import { LayoutBreadcrumbHeader } from "../../../../../components/layout/layout-breadcrumb-header";
import { RegistryDetailSidebar } from "../../../../../components/registry-detail-sidebar";
import { RegistryItem } from "../../../../../components/registry-item";
import { RegistryEntrySkeleton } from "../../../../../components/registry/registry-entry-skeleton";
import { RegistryInstallForm } from "../../../../../components/registry/registry-install-form";
import { RegistryToolSheet } from "../../../../../components/registry/registry-tool-sheet";
import {
  SplitView,
  SplitViewMain,
  SplitViewSide,
} from "../../../../../components/split-view";
import { Button } from "../../../../../components/ui/button";
import { Container } from "../../../../../components/ui/container";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import { toast } from "../../../../../components/ui/toast";
import { useCopyToClipboard } from "../../../../../hooks/use-copy-to-clipboard";
import { trpc } from "../../../../../state/client";
import { useRegistryQuery } from "../../../../../state/use-registry-query";

export default function RegistryEntryPage() {
  const router = useRouter();
  const { registryId } = useParams<{ registryId: string }>();
  const { toolId, serverId, setRegistryQuery } = useRegistryQuery();
  const [_, copy] = useCopyToClipboard();
  const [installFormOpen, setInstallFormOpen] = useState(false);

  const [entryQuery, storeQuery] = trpc.useQueries((t) => [
    t.registry.getEntryByName({
      name: registryId,
    }),
    t.store.getAll(),
  ]);

  const utils = trpc.useUtils();

  const transportMutation = trpc.registry.getTransportForEntry.useMutation();

  const installMutation = trpc.store.addServer.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
    onSuccess: (data, variables) => {
      utils.store.get.invalidate({ proxyId: variables.proxyId });
      utils.store.getAll.invalidate();
      toast({
        title: "Proxy installed",
        description: "This proxy was successfully installed.",
      });
      router.push(`/${variables.proxyId}`);
    },
  });

  const isLoading = entryQuery.isLoading || storeQuery.isLoading;
  const entry = entryQuery.data;

  const handleInstall = async (values: {
    proxyId?: string;
    entryId: string;
    parameters?: Record<string, string>;
  }) => {
    if (!entry) {
      return;
    }

    const transport = await transportMutation.mutateAsync({
      entryName: entry.name,
      parameters: values.parameters ?? {},
    });
    if (values.proxyId) {
      installMutation.mutate({
        proxyId: values.proxyId,
        server: {
          name: entry.name,
          transport,
        },
      });
    }
  };

  const handleCloseTool = () => {
    setRegistryQuery({ toolId: null, serverId });
  };

  useEffect(() => {
    if (!isLoading && !entry) {
      toast({
        title: "Library entry not found",
        description: "The library entry you are looking for does not exist.",
      });
      router.push("/library");
    }
  }, [entry, isLoading]);

  if (isLoading || !entry) {
    return <RegistryEntrySkeleton />;
  }

  const selectedTool = entry.tools?.find((tool) => tool.name === toolId);

  const proxies = storeQuery.data ?? [];

  const handleToolClick = (toolName: string) => {
    setRegistryQuery({ toolId: toolName, serverId });
  };

  return (
    <LayoutView>
      <LayoutBreadcrumbHeader
        breadcrumbs={[
          {
            title: "Library",
            onClick: () => router.push("/library"),
          },
          {
            title: entry.title,
          },
        ]}
      >
        <Popover open={installFormOpen} onOpenChange={setInstallFormOpen}>
          <PopoverTrigger asChild>
            <Button className="ml-auto lg:hidden">Add to proxy</Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-sm max-w-[80dvw] rounded-[20px] lg:hidden"
          >
            <RegistryInstallForm
              registryEntry={entry}
              proxies={proxies}
              onSubmit={handleInstall}
              isSubmitting={installMutation.isPending}
            />
          </PopoverContent>
        </Popover>
      </LayoutBreadcrumbHeader>

      <LayoutViewContent>
        <Container size="xl">
          <SplitView>
            <SplitViewMain>
              <RegistryItem
                entry={entry}
                onToolClick={(tool) => handleToolClick(tool.name)}
              />
            </SplitViewMain>
            <SplitViewSide>
              <RegistryDetailSidebar
                entry={entry}
                proxies={proxies}
                onClickInstall={handleInstall}
                isInstalling={installMutation.isPending}
              />
            </SplitViewSide>
          </SplitView>
        </Container>

        {selectedTool && (
          <RegistryToolSheet
            tool={selectedTool}
            mcpName={entry.title}
            onClose={handleCloseTool}
          />
        )}
      </LayoutViewContent>
    </LayoutView>
  );
}
