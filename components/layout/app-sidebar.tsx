"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import type { SessionUser } from "@/lib/auth/session";
import type { NavItem } from "@/lib/permissions/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Owner",
  ADMIN_INVENTORY: "Admin Inventori",
  ADMIN_WAREHOUSE: "Admin Gudang",
};

// Nav items that have a real route in Sprint 1
const ACTIVE_ROUTES = new Set(["/dashboard"]);

type AppSidebarProps = {
  user: SessionUser;
  navItems: NavItem[];
};

export function AppSidebar({ user, navItems }: AppSidebarProps) {
  const pathname = usePathname();

  const initials = (user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel = ROLE_LABEL[user.role] ?? user.role;

  return (
    <Sidebar>
      {/* Header — app identity */}
      <SidebarHeader className="px-4 py-4">
        <div>
          <p className="text-sm font-semibold leading-tight text-sidebar-foreground">
            Ball Fashion Inventory
          </p>
          <p className="mt-0.5 text-xs leading-tight text-sidebar-foreground/60">
            Operasional Ball, Sortir, Gudang, dan Stocklist
          </p>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isAvailable = ACTIVE_ROUTES.has(item.href);
                const Icon = item.icon;

                if (!isAvailable) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        disabled
                        className="cursor-not-allowed opacity-50"
                        tooltip={item.label}
                      >
                        <Icon />
                        <span>{item.label}</span>
                        <Badge
                          variant="secondary"
                          className="ml-auto text-[10px]"
                        >
                          Segera hadir
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer — user info and logout */}
      <SidebarFooter className="px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar size="default">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name ?? "Pengguna"}
            </span>
            <Badge variant="secondary" className="mt-0.5 w-fit text-[10px]">
              {roleLabel}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Keluar"
          >
            <LogOut />
            <span className="sr-only">Keluar</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
