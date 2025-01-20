import { AppHeader } from "@/components/marginals/app-header";
import { AppProvider } from "@/components/providers/app-provider";
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
      {children}
    </AppProvider>
  );
}
