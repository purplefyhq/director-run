"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { EmailIcon } from "./ui/icon";

export function GetNotifiedButton({ children, onPointerDownCapture, ...props }: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button
      onPointerDown={(e) => {
        onPointerDownCapture?.(e);

        const inputElement = document.querySelector('[data-id="get-notified-email"]') as HTMLInputElement | undefined;

        setTimeout(() => {
          if (inputElement) {
            inputElement.focus({ preventScroll: true });
            inputElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 50);
      }}
      {...props}
    >
      <EmailIcon />
      {children ?? "Get updates"}
    </Button>
  );
}
