"use client";

import * as React from "react";

import { CaretUpDownIcon } from "@phosphor-icons/react";
import { cn } from "../../helpers/cn";

const SelectNative = ({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) => {
  return (
    <div className="relative flex w-full">
      <select
        data-slot="select-native"
        className={cn(
          "peer inline-flex cursor-pointer appearance-none items-center rounded-md border border-input bg-surface text-foreground text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          props.multiple
            ? "py-1 *:px-3 *:py-1 [&_option:checked]:bg-accent"
            : "h-8 ps-3 pe-8",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {!props.multiple && (
        <span className="pointer-events-none absolute inset-y-0 end-2 flex h-full items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50 peer-aria-invalid:text-destructive/80">
          <CaretUpDownIcon
            className="size-3"
            weight="bold"
            aria-hidden="true"
          />
        </span>
      )}
    </div>
  );
};

export { SelectNative };
