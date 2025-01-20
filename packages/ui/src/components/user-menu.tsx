"use client";

import { useAuth } from "@ui/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@ui/components/ui/sidebar";
import { logout } from "@utils/actions";
import { ChevronsUpDown, LogOut, Settings, UserRound } from "lucide-react";
import { toast } from "sonner";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

export function UserMenu({ isSidebarMenu }: { isSidebarMenu?: boolean }) {
  const { user } = useAuth();
  if (isSidebarMenu) {
    const { isMobile } = useSidebar();
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserRound
                  className="stroke-[1.5]"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="flex items-center gap-2">
                    <UserRound
                      className="stroke-[1.5]"
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                  <ThemeSwitcher />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => {
                    toast.promise(logout(), {
                      loading: "Logging out...",
                      success: "Logged out successfully",
                      error: "Error in logging out",
                    });
                  }}
                >
                  <LogOut className="size-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full size-9">
          <UserRound
            className="stroke-[1.5]"
            style={{
              width: "20px",
              height: "20px",
            }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" align="end">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserRound
              className="stroke-[1.5]"
              style={{
                width: "20px",
                height: "20px",
              }}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="size-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              toast.promise(logout(), {
                loading: "Logging out...",
                success: "Logged out successfully",
                error: "Error in logging out",
              });
            }}
          >
            <LogOut className="size-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
