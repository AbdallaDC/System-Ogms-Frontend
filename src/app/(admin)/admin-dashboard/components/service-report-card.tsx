import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  CheckCircle,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface ServiceReportProps {
  service: {
    service_name: string;
    totalBookings: number;
    completedBookings: number;
    totalRevenue: number;
  };
}

export function ServiceReportCard({ service }: ServiceReportProps) {
  const completionRate =
    service.totalBookings > 0
      ? (service.completedBookings / service.totalBookings) * 100
      : 0;

  return (
    <Card className="overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 pb-3">
        <CardTitle className="flex items-center text-lg font-semibold">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-3">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          {service.service_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-muted-foreground">
                Total Bookings
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {service.totalBookings}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              {service.completedBookings}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <span className="text-xl font-bold text-emerald-600">
              ${service.totalRevenue.toLocaleString()}
            </span>
          </div>
          {service.totalRevenue > 0 && (
            <div className="flex items-center text-sm text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Revenue generated</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm font-bold text-blue-600">
              {completionRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={completionRate}
            className="h-3 bg-blue-100 dark:bg-blue-900/50"
            indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}
