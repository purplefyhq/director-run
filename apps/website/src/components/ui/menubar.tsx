"use client";

import { Mark } from "@/components/logo";
import { cn } from "@/lib/cn";
import { Menubar, MenubarContent, MenubarMenu, MenubarPortal, MenubarTrigger } from "@radix-ui/react-menubar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GetNotifiedButton } from "../get-notified-button";
import { SearchIcon } from "./icon";

export function MenuBar() {
  const [value, setValue] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const int = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(int);
  }, []);

  return (
    <Menubar value={value} onValueChange={setValue} className="fixed inset-x-0 top-0 z-20 flex flex-row items-center border-muted-foreground/10 border-b bg-background/80 px-4 py-1 text-muted-foreground backdrop-blur-sm">
      <MenubarMenu value="working-dev">
        <MenubarTrigger className={cn("grid h-6 place-items-center rounded-lg px-1 outline-hidden", "hover:text-foreground", "data-highlighted:bg-muted-foreground/20 data-highlighted:text-foreground", "data-[state=open]:bg-muted-foreground/20 data-[state=open]:text-foreground", "ml-auto")}>
          <Mark className="h-[18px] w-6" />
        </MenubarTrigger>
        <MenubarPortal forceMount>
          <AnimatePresence>
            {value === "working-dev" && (
              <MenubarContent
                onCloseAutoFocus={(e) => e.preventDefault()}
                side="bottom"
                align="start"
                sideOffset={4}
                collisionPadding={16}
                className={cn("relative z-50 flex w-[var(--radix-popper-available-width)] select-none items-center justify-center overflow-hidden rounded-xl border border-secondary bg-popover/80 px-6 py-10 text-center text-popover-foreground shadow-xs backdrop-blur-sm sm:max-w-md sm:px-10 sm:py-14")}
                forceMount
                asChild
              >
                <motion.div
                  initial="visible"
                  exit="hidden"
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  variants={{
                    hidden: {
                      opacity: 0,
                    },
                    visible: {
                      opacity: 1,
                    },
                  }}
                >
                  <div className="flex w-full flex-col gap-2">
                    <h2 className="font-medium text-lg leading-none">Piqued your interest?</h2>
                    <p className="text-pretty text-lg text-muted-foreground leading-snug">Join our mailing list to stay up-to-date and be among the first to know when we launch.</p>

                    <GetNotifiedButton
                      className="mt-4 h-7 gap-x-2 self-center px-3.5 font-medium text-xs [&>svg]:size-4"
                      onPointerDownCapture={() => {
                        setValue("");
                      }}
                    />
                  </div>
                </motion.div>
              </MenubarContent>
            )}
          </AnimatePresence>
        </MenubarPortal>
      </MenubarMenu>

      <div className="grid h-6 place-items-center px-1">
        <SearchIcon className="h-4.5 w-6" />
      </div>
      <span className="select-none px-1 font-medium text-[15px] text-muted-foreground leading-6 tracking-[0.02em]">
        {currentDate
          .toLocaleDateString("en-GB", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/,/g, "")}
      </span>
    </Menubar>
  );
}
