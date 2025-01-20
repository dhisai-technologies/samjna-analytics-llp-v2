import { AppHeader } from "@/components/marginals/app-header";
import { AppProvider } from "@/components/providers/app-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <AppHeader participant />
      {children}
    </AppProvider>
  );
}
