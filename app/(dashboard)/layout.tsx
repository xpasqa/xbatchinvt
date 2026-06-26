import { requireAuth } from "@/lib/auth/session";
import { getNavItemsForRole } from "@/lib/permissions/nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const navItems = getNavItemsForRole(user.role);

  return (
    <SidebarProvider>
      <AppSidebar user={user} navItems={navItems} />
      <SidebarInset>
        <AppHeader user={user} pageTitle="Dashboard" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
