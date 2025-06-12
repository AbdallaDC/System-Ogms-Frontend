// "use client";

// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip,
// } from "recharts";

// interface BookingStatusChartProps {
//   bookingStatusCounts: {
//     pending: number;
//     inProgress: number;
//     completed: number;
//     cancelled: number;
//   };
// }

// export function BookingStatusChart({
//   bookingStatusCounts,
// }: BookingStatusChartProps) {
//   const data = [
//     { name: "Pending", value: bookingStatusCounts.pending, color: "#f59e0b" },
//     {
//       name: "In Progress",
//       value: bookingStatusCounts.inProgress,
//       color: "#3b82f6",
//     },
//     {
//       name: "Completed",
//       value: bookingStatusCounts.completed,
//       color: "#10b981",
//     },
//     {
//       name: "Cancelled",
//       value: bookingStatusCounts.cancelled,
//       color: "#ef4444",
//     },
//   ].filter((item) => item.value > 0);

//   const COLORS = data.map((item) => item.color);

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
//           <p className="font-medium">{payload[0].name}</p>
//           <p className="text-sm text-muted-foreground">
//             Count: <span className="font-medium">{payload[0].value}</span>
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const CustomLegend = ({ payload }: any) => {
//     return (
//       <div className="flex flex-wrap justify-center gap-4 mt-4">
//         {payload.map((entry: any, index: number) => (
//           <div key={index} className="flex items-center gap-2">
//             <div
//               className="w-3 h-3 rounded-full"
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="text-sm font-medium">{entry.value}</span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (data.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64 text-muted-foreground">
//         No booking data available
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-64">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={40}
//             outerRadius={80}
//             paddingAngle={5}
//             dataKey="value"
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip content={<CustomTooltip />} />
//           <Legend content={<CustomLegend />} />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BookingStatusChartProps {
  bookingStatusCounts: {
    pending: number;
    assigned: number;
    completed: number;
    cancelled: number;
  };
}

export function BookingStatusChart({
  bookingStatusCounts,
}: BookingStatusChartProps) {
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
