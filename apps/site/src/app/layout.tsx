import { SiteFooter } from "@/components/marginals/site-footer";
import { SiteHeader } from "@/components/marginals/site-header";
import { appConfig } from "@config/ui";
import { GlobalProvider } from "@ui/components/providers/global-provider";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "@ui/globals.css";

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-custom-background">
        <GlobalProvider>
          <SiteHeader />
          <ScrollArea className="h-[calc(100vh-theme(spacing.14))]">
            {children}
            <SiteFooter />
          </ScrollArea>
        </GlobalProvider>
      </body>
    </html>
  );
}
