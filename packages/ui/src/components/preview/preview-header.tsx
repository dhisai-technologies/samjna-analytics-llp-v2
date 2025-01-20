"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@ui/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@ui/components/ui/sheet";
import { useState } from "react";

import { appConfig } from "@config/ui";
import { Icons } from "@ui/components/icons";
import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/utils";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  { href: "/preview", label: "Home" },
  { href: `${appConfig.url}/about`, label: "About Us" },
  { href: `${appConfig.url}/solutions`, label: "Our Solutions" },
  { href: `${appConfig.url}/contact`, label: "Contact" },
];

export function PreviewHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-background-2 border-neutral-300">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="flex">
            <a rel="noreferrer noopener" href="/" className="ml-2 flex items-center gap-2">
              <Icons.logo className="h-10 w-10 text-primary" />
              <div>
                <h1 className="font-bold">{appConfig.title}</h1>
                <p className="text-xs text-muted-foreground">{appConfig.description}</p>
              </div>
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" onClick={() => setIsOpen(true)} />
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Shadcn/React</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className={cn(
                  "text-sm h-10 px-4 py-2 border-b-4 rounded-md flex items-center justify-center",
                  pathname === route.href ? "border-primary " : "border-transparent hover:bg-neutral-200",
                )}
              >
                {route.label}
              </a>
            ))}
          </nav>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
