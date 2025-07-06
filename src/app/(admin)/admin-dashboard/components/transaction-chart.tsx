'use client';

import { useFetch } from "@/hooks/useApi";
import { Transaction, TransactionResponse } from "@/types/Transaction";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionChart() {
  const { data: transactionData, isLoading } = useFetch<TransactionResponse>(
    "/api/v1/payments"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  const transactions = transactionData?.transactions || [];

  // Process and group data by day
  const processData = () => {
    const dailyData: Record<
      string,
      {
        date: string;
        totalAmount: number;
        transactionCount: number;
        avgAmount: number;
      }
    > = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.paid_at);
      const dateString = date.toISOString().split("T")[0];
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dailyData[dateString]) {
        dailyData[dateString] = {
          date: formattedDate,
          totalAmount: 0,
          transactionCount: 0,
          avgAmount: 0,
        };
      }

      dailyData[dateString].totalAmount += transaction.amount;
      dailyData[dateString].transactionCount += 1;
    });

    // Calculate average amount
    Object.keys(dailyData).forEach((date) => {
      dailyData[date].avgAmount =
        dailyData[date].totalAmount / dailyData[date].transactionCount;
    });

    return Object.values(dailyData);
  };

  const chartData = processData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white  p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold">{data.date}</p>
          <p className="text-sm mt-2">
            <span className="font-medium">Total:</span> $
            {data.totalAmount.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Transactions:</span>{" "}
            {data.transactionCount}
          </p>
          <p className="text-sm">
            <span className="font-medium">Avg/Transaction:</span> $
            {data.avgAmount.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground border rounded-lg">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={40}
            formatter={(value) => (
              <span className="text-sm text-gray-600 ">{value}</span>
            )}
          />
          <Bar
            yAxisId="left"
            dataKey="totalAmount"
            name="Total Amount"
            fill="#4f46e5"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="transactionCount"
            name="Transaction Count"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{
              r: 6,
              stroke: "#10b981",
              strokeWidth: 2,
              fill: "#fff",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
