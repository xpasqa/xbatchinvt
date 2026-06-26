"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

/**
 * LogoutDropdownItem — renders inside a DropdownMenuItem.
 */
export function LogoutDropdownItem() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full cursor-pointer items-center gap-2 text-sm"
    >
      <LogOut className="size-4" />
      <span>Keluar</span>
    </button>
  );
}
