import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { authOptions } from "@/auth";

export type SessionUser = {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
  role: UserRole;
};

/**
 * Returns the current session user or null if not authenticated.
 * Safe to call from any Server Component or Server Action.
 * Never throws — callers decide what to do when null is returned.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

/**
 * Requires an authenticated user.
 * Redirects to /login if no session exists.
 * Returns the authenticated session user.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Requires an authenticated user whose role is in the allowedRoles list.
 * Redirects to /login if not authenticated.
 * Redirects to /dashboard?error=access-denied if the role is not permitted.
 * Returns the authorized session user.
 */
export async function requireRole(
  allowedRoles: UserRole[],
): Promise<SessionUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard?error=access-denied");
  }

  return user;
}
