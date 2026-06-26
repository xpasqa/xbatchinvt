import { redirect } from "next/navigation";
import {
  PackageSearch,
  ShieldX,
  Warehouse,
  Layers,
  Tag,
  BarChart3,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardSummary } from "@/lib/dashboard/get-dashboard-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type DashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await searchParams;
  const isAccessDenied = error === "access-denied";

  const summary = await getDashboardSummary();

  const statCards = [
    {
      title: "Total Stok Aktif",
      value: summary.totalActiveStock,
      description: "Seluruh stok aktif di semua gudang",
      icon: BarChart3,
    },
    {
      title: "Stok Gudang Sortir",
      value: summary.stockGudangSortir,
      description: "Stok tersedia di Gudang Sortir",
      icon: Warehouse,
    },
    {
      title: "Stok Gudang Retail",
      value: summary.stockGudangRetail,
      description: "Stok tersedia di Gudang Retail",
      icon: Warehouse,
    },
    {
      title: "Stok Gudang Grosir",
      value: summary.stockGudangGrosir,
      description: "Stok tersedia di Gudang Grosir",
      icon: Warehouse,
    },
    {
      title: "Total Stoklot",
      value: summary.totalStoklot,
      description: "Total stok lot aktif",
      icon: Layers,
    },
    {
      title: "Total Accessories",
      value: summary.totalAccessories,
      description: "Total stok accessories aktif",
      icon: Tag,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Access denied alert */}
      {isAccessDenied && (
        <Alert variant="destructive" className="max-w-xl">
          <ShieldX />
          <AlertTitle>Akses ditolak.</AlertTitle>
          <AlertDescription>
            Anda tidak memiliki izin untuk membuka halaman tersebut.
          </AlertDescription>
        </Alert>
      )}

      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan operasional inventory.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">
                  {card.value.toLocaleString("id-ID")}
                </p>
                <CardDescription className="mt-1 text-xs">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty activity state */}
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <PackageSearch className="size-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Belum ada aktivitas inventory.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Fitur Ball, Sortir, dan Stocklist akan tersedia pada sprint berikutnya.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
