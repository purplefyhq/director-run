import { createRegistryClient } from "@director.run/registry/client";
import { t } from "@director.run/utilities/trpc";
import { z } from "zod";

export function createRegistryRouter({ registryURL }: { registryURL: string }) {
  const registryClient = createRegistryClient(registryURL);

  return t.router({
    getEntries: t.procedure
      .input(
        z.object({
          pageIndex: z.number().min(0),
          pageSize: z.number().min(1),
          searchQuery: z.string().trim().optional(),
        }),
      )
      .query(({ input }) => registryClient.entries.getEntries.query(input)),

    getEntryByName: t.procedure
      .input(z.object({ name: z.string() }))
      .query(({ input }) => registryClient.entries.getEntryByName.query(input)),
    getTransportForEntry: t.procedure
      .input(
        z.object({
          entryName: z.string(),
          parameters: z.record(z.string(), z.string()).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return await registryClient.entries.getTransportForEntry.query({
          entryName: input.entryName,
          parameters: input.parameters,
        });
      }),
  });
}
