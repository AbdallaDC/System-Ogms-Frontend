'use client';

import { useFetch } from "@/hooks/useApi";
import { BookingListResponse } from "@/types/Booking";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingStatusChart() {
  const { data: bookingsData, isLoading } = useFetch<BookingListResponse>(
    "/api/v1/bookings"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  const bookingStatusCounts = {
    pending:
      bookingsData?.bookings.filter((b) => b.status.toLowerCase() === "pending")
        .length || 0,
    assigned:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "assigned"
      ).length || 0,
    completed:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "completed"
      ).length || 0,
    cancelled:
      bookingsData?.bookings.filter(
        (b) => b.status.toLowerCase() === "cancelled"
      ).length || 0,
  };

  const data = [
    { name: "Pending", value: bookingStatusCounts.pending, color: "#f59e0b" },
    {
      name: "Assigned",
      value: bookingStatusCounts.assigned,
      color: "#3b82f6",
    },
    {
      name: "Completed",
      value: bookingStatusCounts.completed,
      color: "#10b981",
    },
    {
      name: "Cancelled",
      value: bookingStatusCounts.cancelled,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200  rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No booking data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 25, // Increased bottom margin for XAxis labels
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={50} // Increased height to accommodate angled labels
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Bookings">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
