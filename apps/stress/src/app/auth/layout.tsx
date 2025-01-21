import { AppProvider } from "@/components/providers/app-provider";
import { appConfig, apps } from "@config/ui";
import { FlipWords } from "@ui/components/flip-words";
import { Icons } from "@ui/components/icons";
import { Copyright } from "lucide-react";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = apps.stress;
  return (
    <AppProvider>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-background lg:flex">
          <div className="absolute inset-0 bg-foreground" />
          <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <app.Icon className="size-5" />
            </div>
            <div>
              <h3>{app.name}</h3>
              <p className="text-muted-foreground text-sm">{appConfig.title}</p>
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <div className="text-2xl mx-auto font-normal text-muted-foreground">
              Building
              <FlipWords words={["Scalable", "Secured", "State-of-the-Art", "Innovative"]} /> <br />
              <span>AI Models for Emotional Well-being</span>
            </div>
          </div>
          <div className="relative z-20 mt-auto flex gap-2 justify-between">
            <a href={appConfig.url}>
              <Icons.logo className="size-10" />
            </a>
            <p className="flex text-muted-foreground text-xs items-center gap-2">
              <Copyright className="w-3 h-3" />
              <span>
                {appConfig.copyright}, {appConfig.title}
              </span>
            </p>
          </div>
        </div>
        <div className="lg:p-8 relative w-full h-full">
          <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
