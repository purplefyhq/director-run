import { loops } from "@/lib/loops";
import { APIError } from "loops";
import { z } from "zod";
import { createTRPCRouter, t } from "../init";

export const mailingListRouter = createTRPCRouter({
  subscribe: t.procedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
    try {
      const resp = await loops.updateContact(input.email, {
        email: input.email,
      });

      if (resp.success) {
        return { success: true, data: resp };
      }

      return { success: false, error: resp.message };
    } catch (error) {
      if (error instanceof APIError) {
        return { success: false, error: error.message };
      }

      return { success: false };
    }
  }),
});
