import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-x-3 whitespace-nowrap rounded-full font-medium font-mono text-[15px] uppercase leading-none tracking-wider transition-colors",
    "h-9 cursor-pointer bg-primary px-5 text-primary-foreground",
    "opacity-100 transition-opacity duration-300 ease-in-out hover:opacity-70",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:border-muted-foreground disabled:bg-primary/10 disabled:text-foreground/40",
    "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
