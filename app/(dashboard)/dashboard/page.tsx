import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <p className="text-muted-foreground">
        Dashboard akan tersedia pada tahap berikutnya.
      </p>
    </div>
  );
}
