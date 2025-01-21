import { appConfig, apps } from "@config/ui";
import { Icons } from "@ui/components/icons";
import { ThemeSwitcher } from "@ui/components/theme-switcher";
import { Separator } from "@ui/components/ui/separator";
import { UserMenu } from "@ui/components/user-menu";
import Link from "next/link";

export function AppHeader({ participant }: { participant?: boolean }) {
  const app = apps.stress;
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
        <div className="flex gap-2 items-center">
          <ThemeSwitcher />
          {!participant && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
