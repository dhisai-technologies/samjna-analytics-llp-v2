"use client";

import { appConfig, apps } from "@config/ui";
import { Icons } from "@ui/components/icons";
import { ThemeSwitcher } from "@ui/components/theme-switcher";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@ui/components/ui/navigation-menu";
import { Separator } from "@ui/components/ui/separator";
import { UserMenu } from "@ui/components/user-menu";
import { cn } from "@ui/utils";
import { History, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Sessions", icon: History, href: "/sessions" },
  { title: "Prevalidation", icon: ShieldCheck, href: "/prevalidation" },
];

export function AppHeader({ participant }: { participant?: boolean }) {
  const app = apps.stress;
  const pathname = usePathname();
  return (
    <header className="sticky h-14 border-b top-0 z-40 w-full bg-sidebar py-2">
      <div className="flex px-4 items-center justify-between h-full">
        <Link className="h-12 flex items-center gap-2" href="/">
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
        </Link>
        <nav className="flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((item) => {
                if (item.href) {
                  return (
                    <NavigationMenuItem key={item.title}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "font-semibold border w-40",
                            (item.href === "/" ? pathname === item.href : pathname.startsWith(item.href))
                              ? "text-primary bg-primary-foreground hover:text-primary/90 hover:bg-primary-foreground/50"
                              : "text-muted-foreground bg-transparent",
                          )}
                        >
                          {item.icon && <item.icon className="size-4 mr-2" />}
                          <span>{item.title}</span>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  );
                }
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="flex gap-2 items-center">
          <ThemeSwitcher />
          {!participant && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
