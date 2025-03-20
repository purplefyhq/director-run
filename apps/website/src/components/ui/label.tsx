"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const labelVariants = cva("text-base peer-disabled:cursor-not-allowed peer-disabled:opacity-70", {
  variants: {
    visible: {
      true: "",
      false: "sr-only",
    },
  },
  defaultVariants: {
    visible: true,
  },
});

interface LabelProps extends React.ComponentPropsWithRef<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {}

const Label = ({ className, visible, ...props }: LabelProps) => <LabelPrimitive.Root className={cn(labelVariants({ visible }), className)} {...props} />;

export { Label };
