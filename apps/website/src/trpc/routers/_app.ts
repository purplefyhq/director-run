import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { healthRouter } from "./health";
import { mailingListRouter } from "./mailing-list";

export const appRouter = createTRPCRouter({
  mailingList: mailingListRouter,
  health: healthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
