import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Ball Fashion Inventory</CardTitle>
        <CardDescription>
          Sistem operasional untuk Ball, Sortir, Gudang, dan Stocklist.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <LoginForm />
      </CardContent>
    </Card>
  );
}
