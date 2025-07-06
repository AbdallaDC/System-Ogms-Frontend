'use client';

import { useFetch } from "@/hooks/useApi";
import { TransactionResponse } from "@/types/Transaction";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp } from "lucide-react";

export function TotalRevenueCard() {
  const { data: paymentsData, isLoading } = useFetch<TransactionResponse>(
    "/api/v1/payments"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  const totalRevenue = paymentsData?.transactions
    ?.filter((t) => t.status.toLowerCase() === "paid")
    .reduce((sum, t) => sum + t.amount, 0)
    .toLocaleString() || 0;

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <CreditCard className="h-4 w-4" />
          </div>
          Total Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          ${totalRevenue}
        </div>
        <div className="flex items-center text-sm text-emerald-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>{paymentsData?.result || 0} transactions</span>
        </div>
      </CardContent>
    </Card>
  );
}