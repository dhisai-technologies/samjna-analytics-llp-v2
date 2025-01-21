import { AppHeader } from "@/components/marginals/app-header";
import { AppProvider } from "@/components/providers/app-provider";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { getSessionUser } from "@utils/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();
  return (
    <AppProvider user={user}>
      <AppHeader />
      <ScrollArea className="h-[calc(100vh-theme(spacing.14))] w-screen">{children}</ScrollArea>
    </AppProvider>
  );
}
