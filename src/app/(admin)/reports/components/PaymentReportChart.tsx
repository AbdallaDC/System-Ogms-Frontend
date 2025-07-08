import React from "react";
import { useFetch } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { PaymentResponse, PaymentRecord } from "./PaymentReportTable";

interface PaymentReportChartProps {
  queryString: string;
}

const PaymentReportChart: React.FC<PaymentReportChartProps> = ({
  queryString,
}) => {
  const endpoint = `/api/v1/payments/report${
    queryString ? `?${queryString}` : ""
  }`;
  const { data, isLoading } = useFetch<PaymentResponse>(endpoint);

  // Process and group data by day
  const processData = () => {
    if (!data?.data) return [];
    const dailyData: Record<
      string,
      {
        date: string;
        totalAmount: number;
        paymentCount: number;
        avgAmount: number;
      }
    > = {};
    data.data.forEach((payment: PaymentRecord) => {
      if (!payment.paid_at) return;
      const date = new Date(payment.paid_at);
      const dateString = date.toISOString().split("T")[0];
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dailyData[dateString]) {
        dailyData[dateString] = {
          date: formattedDate,
          totalAmount: 0,
          paymentCount: 0,
          avgAmount: 0,
        };
      }
      dailyData[dateString].totalAmount += payment.amount;
      dailyData[dateString].paymentCount += 1;
    });
    Object.keys(dailyData).forEach((date) => {
      dailyData[date].avgAmount =
        dailyData[date].totalAmount / dailyData[date].paymentCount;
    });
    return Object.values(dailyData);
  };

  const chartData = processData();

  // Summary metrics
  const totalAmount = data?.totalAmount || 0;
  const totalCount = data?.count || 0;
  const avgAmount = totalCount ? totalAmount / totalCount : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold">{d.date}</p>
          <p className="text-sm mt-2">
            <span className="font-medium">Total:</span> $
            {d.totalAmount.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Payments:</span> {d.paymentCount}
          </p>
          <p className="text-sm">
            <span className="font-medium">Avg/Payment:</span> $
            {d.avgAmount.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground border rounded-lg">
        No payment data available
      </div>
    );
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 min-w-[160px] border">
          <div className="text-xs text-gray-500 mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-emerald-600">
            ${totalAmount.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[160px] border">
          <div className="text-xs text-gray-500 mb-1">Payments</div>
          <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[160px] border">
          <div className="text-xs text-gray-500 mb-1">Avg/Payment</div>
          <div className="text-2xl font-bold text-indigo-600">
            ${avgAmount.toFixed(2)}
          </div>
        </div>
      </div>
      {/* Area Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="totalAmount"
              name="Total Amount"
              stroke="#4f46e5"
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={3}
              dot={{ r: 3, fill: "#4f46e5", stroke: "#fff", strokeWidth: 1 }}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#4f46e5",
                strokeWidth: 2,
              }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentReportChart;
