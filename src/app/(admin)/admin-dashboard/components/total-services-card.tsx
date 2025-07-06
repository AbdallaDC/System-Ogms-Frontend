'use client';

import { useFetch } from "@/hooks/useApi";
import { ServiceListResponse } from "@/types/Service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wrench } from "lucide-react";

export function TotalServicesCard() {
  const { data: servicesData, isLoading } = useFetch<ServiceListResponse>(
    "/api/v1/services"
  );

  if (isLoading) {
    return <Skeleton className="w-full h-32" />;
  }

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Wrench className="h-4 w-4" />
          </div>
          Total Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {servicesData?.count || 0}
        </div>
        <div className="flex items-center text-sm text-blue-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>Available services</span>
        </div>
      </CardContent>
    </Card>
  );
}