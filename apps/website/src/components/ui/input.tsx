import * as React from "react";

import { cn } from "@/lib/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full items-center rounded-lg border-0 bg-white px-5 text-[19px] tracking-[0.01em] transition-colors sm:h-14 sm:text-[21px]",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "placeholder:text-foreground/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
