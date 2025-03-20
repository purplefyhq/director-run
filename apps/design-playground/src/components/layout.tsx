"use client";

import { CollapsibleMenuGroup, Menu, MenuAction, MenuGroup } from "@workingco/design/components/menu";
import { cn } from "@workingco/design/lib/cn";
import { BooksSpinesIcon, FlowerpotIcon, GearIcon, LayersIcon, MegaphoneIcon, PlusIcon, ServerIcon } from "@workingco/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Layout({ children, className, ...props }: React.ComponentPropsWithRef<"div">) {
  const pathname = usePathname();
  return (
    <div className={cn("flex h-screen w-full gap-x-1.5 overflow-hidden bg-gray-3 p-1.5", className)} {...props}>
      <div className="flex h-full w-[220px] shrink-0 flex-col overflow-y-auto overflow-x-hidden">
        <Menu>
          <CollapsibleMenuGroup label="My Helpful Server">
            <MenuAction asChild isActive={pathname === "/"}>
              <Link href="/">
                <ServerIcon />
                <span>Overview</span>
              </Link>
            </MenuAction>
            <MenuAction asChild isActive={pathname === "/extensions"}>
              <Link href="/extensions">
                <LayersIcon />
                <span>Extensions</span>
              </Link>
            </MenuAction>
            <MenuAction asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <GearIcon />
                <span>Settings</span>
              </Link>
            </MenuAction>
          </CollapsibleMenuGroup>

          <MenuGroup>
            <MenuAction disabled>
              <PlusIcon />
              <span>Create server</span>
            </MenuAction>
          </MenuGroup>

          <MenuGroup className="mt-auto">
            <MenuAction disabled>
              <BooksSpinesIcon />
              <span>Documentation</span>
            </MenuAction>
            <MenuAction disabled>
              <MegaphoneIcon />
              <span>Send feedback</span>
            </MenuAction>
            <MenuAction disabled>
              <FlowerpotIcon />
              <span>Updates</span>
            </MenuAction>
          </MenuGroup>
        </Menu>
      </div>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-md border border-gray-5 bg-gray-1">{children}</div>
    </div>
  );
}
