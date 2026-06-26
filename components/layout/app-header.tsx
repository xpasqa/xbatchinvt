import type { SessionUser } from "@/lib/auth/session";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutDropdownItem } from "@/components/auth/logout-button";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Owner",
  ADMIN_INVENTORY: "Admin Inventori",
  ADMIN_WAREHOUSE: "Admin Gudang",
};

type AppHeaderProps = {
  user: SessionUser;
  pageTitle: string;
};

export function AppHeader({ user, pageTitle }: AppHeaderProps) {
  const initials = (user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel = ROLE_LABEL[user.role] ?? user.role;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Left: sidebar trigger + page title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium">{pageTitle}</span>
      </div>

      {/* Right: user info */}
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:block">
          {user.name}
        </span>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {roleLabel}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Menu pengguna</span>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {user.name ?? "Pengguna"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutDropdownItem />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
