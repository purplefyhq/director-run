import type { AnyTRPCMiddlewareFunction } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { getLogger } from "./logger";

const logger = getLogger("trpc");

export const logTRPCRequest: AnyTRPCMiddlewareFunction = async ({
  path,
  type,
  next,
  input,
}) => {
  if (path === "health") {
    return next();
  }

  const start = Date.now();
  logger.trace(
    {
      path,
      type,
      input,
    },
    "trpc request received",
  );

  try {
    const result = await next();
    const duration = Date.now() - start;

    if (result.ok) {
      logger.trace(
        {
          path,
          type,
          duration,
        },
        "trpc request successful",
      );
    } else {
      logger.error(
        {
          path,
          type,
          duration,
          error: result.error,
        },
        "trpc request failed",
      );
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(
      {
        path,
        type,
        duration,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      "trpc request failed",
    );
    throw error;
  }
};

export const trpcBase = initTRPC.context().create({
  transformer: superjson,
  errorFormatter: ({ shape }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
      },
    };
  },
});

const baseProcedure = trpcBase.procedure.use(logTRPCRequest);

export const t = {
  router: trpcBase.router,
  procedure: baseProcedure,
  middleware: trpcBase.middleware,
};
