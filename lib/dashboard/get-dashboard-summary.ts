/**
 * Dashboard summary data for Sprint 1.
 * Inventory models do not exist yet — all counts return 0.
 * This function will be updated in Sprint 2+ when StockLot and Ball models exist.
 */

export type DashboardSummary = {
  totalActiveStock: number;
  stockGudangSortir: number;
  stockGudangRetail: number;
  stockGudangGrosir: number;
  totalStoklot: number;
  totalAccessories: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // Inventory models (Ball, StockLot, ProductVariant) are not yet implemented.
  // Values are returned as 0 until Sprint 2 introduces the inventory schema.
  return {
    totalActiveStock: 0,
    stockGudangSortir: 0,
    stockGudangRetail: 0,
    stockGudangGrosir: 0,
    totalStoklot: 0,
    totalAccessories: 0,
  };
}
