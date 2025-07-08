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

export interface BookingResponse {
  status: string;
  count: number;
  data: BookingRecord[];
}

export interface BookingRecord {
  booking_id: string;
  customer: Customer | null;
  service: Service;
  status: string;
  createdAt: string;
  mechanic: Mechanic | null;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  id: string;
}

export interface Service {
  _id: string;
  service_name: string;
  price: number;
  id: string;
}

export interface Mechanic {
  _id: string;
  name: string;
  email: string;
  id: string;
}

interface BookingReportChartProps {
  queryString: string;
}

const BookingReportChart: React.FC<BookingReportChartProps> = ({
  queryString,
}) => {
  const endpoint = `/api/v1/bookings/report${
    queryString ? `?${queryString}` : ""
  }`;
  const { data, isLoading } = useFetch<BookingResponse>(endpoint);

  // Process and group data by day
  const processData = () => {
    if (!data?.data) return [];
    const dailyData: Record<
      string,
      {
        date: string;
        total: number;
        completed: number;
        assigned: number;
        pending: number;
        cancelled: number;
      }
    > = {};
    data.data.forEach((booking: BookingRecord) => {
      if (!booking.createdAt) return;
      const date = new Date(booking.createdAt);
      const dateString = date.toISOString().split("T")[0];
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dailyData[dateString]) {
        dailyData[dateString] = {
          date: formattedDate,
          total: 0,
          completed: 0,
          assigned: 0,
          pending: 0,
          cancelled: 0,
        };
      }
      dailyData[dateString].total += 1;
      if (booking.status === "completed") dailyData[dateString].completed += 1;
      if (booking.status === "assigned") dailyData[dateString].assigned += 1;
      if (booking.status === "pending") dailyData[dateString].pending += 1;
      if (booking.status === "cancelled") dailyData[dateString].cancelled += 1;
    });
    return Object.values(dailyData);
  };

  const chartData = processData();

  // Summary metrics
  const total = data?.data?.length || 0;
  const completed =
    data?.data?.filter((b) => b.status === "completed").length || 0;
  const assigned =
    data?.data?.filter((b) => b.status === "assigned").length || 0;
  const pending = data?.data?.filter((b) => b.status === "pending").length || 0;
  const cancelled =
    data?.data?.filter((b) => b.status === "cancelled").length || 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold">{d.date}</p>
          <p className="text-sm mt-2">
            <span className="font-medium">Total:</span> {d.total}
          </p>
          <p className="text-sm">
            <span className="font-medium">Completed:</span> {d.completed}
          </p>
          <p className="text-sm">
            <span className="font-medium">Assigned:</span> {d.assigned}
          </p>
          <p className="text-sm">
            <span className="font-medium">Pending:</span> {d.pending}
          </p>
          <p className="text-sm">
            <span className="font-medium">Cancelled:</span> {d.cancelled}
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
        No booking data available
      </div>
    );
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 min-w-[140px] border">
          <div className="text-xs text-gray-500 mb-1">Total Bookings</div>
          <div className="text-2xl font-bold text-blue-600">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[140px] border">
          <div className="text-xs text-gray-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-emerald-600">{completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[140px] border">
          <div className="text-xs text-gray-500 mb-1">Assigned</div>
          <div className="text-2xl font-bold text-indigo-600">{assigned}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[140px] border">
          <div className="text-xs text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[140px] border">
          <div className="text-xs text-gray-500 mb-1">Cancelled</div>
          <div className="text-2xl font-bold text-red-600">{cancelled}</div>
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
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e42" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#f59e42" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
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
              dataKey="total"
              name="Total"
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
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorCompleted)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="assigned"
              name="Assigned"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorAssigned)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="pending"
              name="Pending"
              stroke="#f59e42"
              fillOpacity={1}
              fill="url(#colorPending)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              name="Cancelled"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorCancelled)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingReportChart;
