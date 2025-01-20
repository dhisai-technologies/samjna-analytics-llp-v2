"use client";
import { appConfig, apps } from "@config/ui";
import { Icons } from "@ui/components/icons";
import { Separator } from "@ui/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/components/ui/sidebar";
import { UserMenu } from "@ui/components/user-menu";
import { cn } from "@ui/utils";
import { Aperture, Package, UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";
import type * as React from "react";

const links = [
  {
    name: "User Management",
    url: "/users",
    icon: UsersRound,
    active: "default",
  },
  {
    name: "Interview Questions",
    url: "/interview-questions",
    icon: apps.interview.Icon,
    active: "default",
  },
  {
    name: "Nursing Questions",
    url: "/nursing-questions",
    icon: apps.nursing.Icon,
    active: "default",
  },
  {
    name: "Recorded Videos",
    url: "/recorded",
    icon: Aperture,
    active: "default",
  },
  {
    name: "AI Models",
    url: "/models",
    icon: Package,
    active: "default",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const app = apps.admin;
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center h-12 px-2">
          <Icons.logo className="!size-5" />
          <Separator orientation="vertical" className="h-8 w-[2px]" />
          <div className="flex gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <app.Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{app.name}</span>
              <span className="truncate text-muted-foreground text-xs">{appConfig.title}</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            {links.map((item) => {
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={cn(
                        "transition-all hover:bg-foreground/5 hover:text-foreground",
                        item.active === "default" &&
                          pathname === item.url &&
                          "hover:bg-foreground/10 bg-foreground/10 text-foreground font-medium",
                        item.active === "include" &&
                          pathname.includes(item.url) &&
                          "hover:bg-foreground/10 bg-foreground/10 text-foreground font-medium",
                      )}
                    >
                      <item.icon className="text-primary" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu isSidebarMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
