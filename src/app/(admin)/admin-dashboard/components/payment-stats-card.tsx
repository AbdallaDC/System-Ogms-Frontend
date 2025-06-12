import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import type { Transaction } from "@/types/Transaction";

interface PaymentStatsCardProps {
  transactions: Transaction[];
}

export function PaymentStatsCard({ transactions }: PaymentStatsCardProps) {
  // Calculate payment statistics
  const totalTransactions = transactions.length;
  const paidTransactions = transactions.filter(
    (t) =>
      t.status.toLowerCase() === "paid" ||
      t.status.toLowerCase() === "success" ||
      t.status.toLowerCase() === "completed"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status.toLowerCase() === "pending"
  ).length;
  const failedTransactions = transactions.filter(
    (t) =>
      t.status.toLowerCase() === "failed" ||
      t.status.toLowerCase() === "cancelled"
  ).length;

  const totalRevenue = transactions
    .filter(
      (t) =>
        t.status.toLowerCase() === "paid" ||
        t.status.toLowerCase() === "success" ||
        t.status.toLowerCase() === "completed"
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const averageTransaction =
    totalTransactions > 0 ? totalRevenue / paidTransactions : 0;

  return (
    <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-500" />
          Payment Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {totalTransactions}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Transactions
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Successful Payments</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            >
              {paidTransactions}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Pending Payments</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
            >
              {pendingTransactions}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Failed Payments</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            >
              {failedTransactions}
            </Badge>
          </div>
        </div>

        {averageTransaction > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Average Transaction</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                ${averageTransaction.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
