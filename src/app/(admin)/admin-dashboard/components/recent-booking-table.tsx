import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Booking {
  _id: string;
  user_id: {
    name: string;
    email: string;
  };
  vehicle_id: {
    model: string;
    plate_number: string;
  };
  booking_date: string;
  status: string;
}

interface RecentBookingsTableProps {
  bookings: Booking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "in progress":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Vehicle
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.user_id.name}`}
                      alt={booking.user_id.name}
                    />
                    <AvatarFallback>
                      {booking.user_id.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{booking.user_id.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.user_id.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{booking.vehicle_id.model}</div>
                <div className="text-xs text-muted-foreground">
                  {booking.vehicle_id.plate_number}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">
                  {format(new Date(booking.booking_date), "MMM d, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(booking.booking_date), "h:mm a")}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
