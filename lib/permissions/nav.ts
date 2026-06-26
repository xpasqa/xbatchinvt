import type { UserRole } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Archive,
  ArrowLeftRight,
  LogOut,
  History,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
};

/**
 * Canonical navigation configuration.
 * Roles are sourced from docs/02-demo-scope-and-routes.md section 2.1.
 *
 * OWNER         — all 7 items
 * ADMIN_INVENTORY — all 7 items
 * ADMIN_WAREHOUSE — 5 items (no Ball/Batch, no Master Data)
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY", "ADMIN_WAREHOUSE"],
  },
  {
    label: "Ball / Batch",
    href: "/balls",
    icon: Package,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY"],
  },
  {
    label: "Stocklist",
    href: "/stocklist",
    icon: Archive,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY", "ADMIN_WAREHOUSE"],
  },
  {
    label: "Transfer Gudang",
    href: "/transfers",
    icon: ArrowLeftRight,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY", "ADMIN_WAREHOUSE"],
  },
  {
    label: "Barang Keluar",
    href: "/stock-out",
    icon: LogOut,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY", "ADMIN_WAREHOUSE"],
  },
  {
    label: "Riwayat Pergerakan",
    href: "/movements",
    icon: History,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY", "ADMIN_WAREHOUSE"],
  },
  {
    label: "Master Data",
    href: "/master-data",
    icon: Settings,
    allowedRoles: ["OWNER", "ADMIN_INVENTORY"],
  },
];

/**
 * Returns only the nav items permitted for the given role.
 * Pure function — no database calls, no React rendering.
 */
export function getNavItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
}
