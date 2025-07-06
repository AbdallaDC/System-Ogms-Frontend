'use client';

import { useFetch } from "@/hooks/useApi";
import { InventoryListResponse } from "@/types/Inventory";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp } from "lucide-react";

export function InventoryItemsCard() {
  const { data: inventoryData, isLoading } = useFetch<InventoryListResponse>(
    "/api/v1/inventory"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-purple-100 flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Package className="h-4 w-4" />
          </div>
          Inventory Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {inventoryData?.result || 0}
        </div>
        <div className="flex items-center text-sm text-purple-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>Available items</span>
        </div>
      </CardContent>
    </Card>
  );
}