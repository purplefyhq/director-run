"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/lib/cn";
import { AppContainer } from "../app-layout";
import { XIcon } from "./icon";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({ className, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 overflow-auto bg-background/50 backdrop-blur-lg", "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in", className)} {...props} />
);

const DialogContent = ({ className, children, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) => {
  return (
    <DialogPortal>
      <DialogOverlay className="grid items-start sm:place-items-center">
        <AppContainer asChild>
          <DialogPrimitive.Content
            className={cn(
              "relative z-50 bg-transparent py-24 duration-200",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-3 data-[state=open]:slide-in-from-top-3 data-[state=closed]:animate-out data-[state=open]:animate-in",
              "!gap-y-0",
              className,
            )}
            {...props}
          >
            <div className="">
              <DialogPrimitive.Close className="absolute top-4 right-4 outline-none">
                <XIcon className="size-10" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
            {children}
          </DialogPrimitive.Content>
        </AppContainer>
      </DialogOverlay>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...props }: React.ComponentPropsWithRef<"div">) => <div className={cn("flex flex-col gap-y-[1em]", className)} {...props} />;
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.ComponentPropsWithRef<"div">) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end", className)} {...props} />;
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({ className, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>) => <DialogPrimitive.Title className={cn("text-foreground text-paragraph--large", className)} {...props} />;

const DialogDescription = ({ className, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>) => <DialogPrimitive.Description className={cn("text-foreground text-paragraph--large", className)} {...props} />;

export { Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
