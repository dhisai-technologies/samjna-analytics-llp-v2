import { AppSidebar } from "@/components/marginals/app-sidebar";
import { AppProvider } from "@/components/providers/app-provider";
import { SidebarInset, SidebarProvider } from "@ui/components/ui/sidebar";
import { getSessionUser } from "@utils/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();
  return (
    <AppProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
