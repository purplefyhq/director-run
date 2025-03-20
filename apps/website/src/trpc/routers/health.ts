import { createTRPCRouter, t } from "../init";

export const healthRouter = createTRPCRouter({
  ping: t.procedure.query(() => {
    return { pong: true, ok: true };
  }),
});
