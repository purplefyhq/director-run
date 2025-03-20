import { cn } from "@/lib/cn";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import type React from "react";
import { GetNotifiedButton } from "./get-notified-button";
import { Mark } from "./logo";

interface AppContainerProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

export function AppContainer({ children, className, asChild, ...props }: AppContainerProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn("mx-auto flex w-full max-w-5xl flex-col gap-y-8 sm:gap-y-12", "px-5 sm:px-14 md:px-20", className)} {...props}>
      {children}
    </Comp>
  );
}

interface AppLayoutProps extends React.ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

export function AppLayout({ children, className, asChild, ...props }: AppLayoutProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn("relative flex min-h-[100dvh] flex-col gap-y-32 pt-16 pb-12 sm:pb-14 md:pb-20", className)} {...props}>
      {children}
    </Comp>
  );
}

export function AppHeader() {
  return (
    <AppContainer className="flex-row justify-between" asChild>
      <header>
        <Link
          href="/"
          className={cn(
            "size-10 rounded-sm bg-background outline-hidden",
            "transition-opacity duration-200 ease-in-out hover:opacity-70",
            "ring-1 ring-transparent ring-offset-8 ring-offset-transparent",
            "focus-visible:bg-muted focus-visible:ring-primary/10 focus-visible:ring-offset-muted",
            "dark:focus-visible:ring-primary/20",
          )}
        >
          <div className="sr-only">working.dev</div>
          <Mark className="h-full w-full" aria-hidden />
        </Link>

        <GetNotifiedButton />
      </header>
    </AppContainer>
  );
}
