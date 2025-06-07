"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function RevenueChart() {
  // Sample data - in a real app, this would come from your API
  const data = [
    { month: "Jan", revenue: 4200 },
    { month: "Feb", revenue: 5800 },
    { month: "Mar", revenue: 4900 },
    { month: "Apr", revenue: 6500 },
    { month: "May", revenue: 7200 },
    { month: "Jun", revenue: 8100 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Revenue:{" "}
            <span className="font-medium text-emerald-600">
              ${payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            className="text-sm"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-sm"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="url(#revenueGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
