import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../helpers/cn";
import { Separator } from "./separator";
import { textVariants } from "./typography";

interface SectionProps extends React.ComponentProps<"section"> {
  asChild?: boolean;
}

export function Section({
  children,
  className,
  asChild,
  ...props
}: SectionProps) {
  const Comp = asChild ? Slot : "section";

  return (
    <Comp
      data-slot="section"
      className={cn("relative flex scroll-m-20 flex-col gap-y-3", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function SectionHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="section-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </header>
  );
}

interface SectionTitleProps
  extends React.ComponentProps<"h1">,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

export function SectionTitle({
  children,
  className,
  asChild,
  invisibles,
  variant = "h1",
  ...props
}: SectionTitleProps) {
  const Comp = asChild ? Slot : "h1";

  return (
    <Comp
      data-slot="section-title"
      className={cn(textVariants({ variant, invisibles }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface SectionDescriptionProps
  extends React.ComponentProps<"p">,
    Omit<VariantProps<typeof textVariants>, "variant"> {
  asChild?: boolean;
}

export function SectionDescription({
  children,
  className,
  asChild,
  invisibles,
  ...props
}: SectionDescriptionProps) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      data-slot="section-description"
      className={cn(
        textVariants({ variant: "p", invisibles }),
        "max-w-md text-fg-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export const SectionSeparator = (
  props: React.ComponentProps<typeof Separator>,
) => {
  return <Separator data-slot="section-separator" {...props} />;
};
