"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export function useMailingModal() {
  const [open, setOpen] = useQueryState("mailing", parseAsBoolean.withDefault(false));

  return {
    open,
    setOpen,
  };
}
