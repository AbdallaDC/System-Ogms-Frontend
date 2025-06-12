// "use client";
// import { useFetch } from "@/hooks/useApi";
// import React from "react";
// import TransactionTable from "./components/TransactionTable";

// const TransactionsPages = () => {
//   const {
//     data: transactionsData,
//     error,
//     isLoading,
//   } = useFetch<TransactionResponse>("/api/v1/payments");
//   if (isLoading) return <div>Loading...</div>;
//   return (
//     <TransactionTable transactions={transactionsData?.transactions || []} />
//   );
// };

// export default TransactionsPages;

"use client";

import { useFetch } from "@/hooks/useApi";
import { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Filter,
  X,
  Calendar,
  Phone,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  user_id: string;
  id: string;
}

interface Service {
  _id: string;
  service_name: string;
  price: number;
  service_id: string;
  id: string;
}

interface Booking {
  _id: string;
  vehicle_id: string;
  service_id: string;
  booking_date: string;
  status: string;
}

interface Transaction {
  _id: string;
  payment_id: string;
  user_id: User;
  service_id: Service;
  booking_id: Booking;
  phone: string;
  method: string;
  amount: number;
  status: string;
  referenceId: string;
  transactionId: string;
  responseMessage: string;
  paid_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  orderId?: string;
  issuerTransactionId?: string;
  accountType?: string;
}

interface TransactionResponse {
  status: string;
  result: number;
  transactions: Transaction[];
}

interface FilterParams {
  phone?: string;
  startDate?: string;
  endDate?: string;
}

const TransactionsPage = () => {
  const [filters, setFilters] = useState<FilterParams>({});
  const [tempFilters, setTempFilters] = useState<FilterParams>({});

  // Build query string from filters
  const buildQueryString = (filterParams: FilterParams) => {
    const params = new URLSearchParams();
    if (filterParams.phone) params.append("phone", filterParams.phone);
    if (filterParams.startDate)
      params.append("startDate", filterParams.startDate);
    if (filterParams.endDate) params.append("endDate", filterParams.endDate);
    return params.toString();
  };

  const queryString = buildQueryString(filters);
  const apiUrl = queryString
    ? `/api/v1/payments?${queryString}`
    : "/api/v1/payments";

  const {
    data: transactionsData,
    error,
    isLoading,
  } = useFetch<TransactionResponse>(apiUrl);

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
  };

  const handleClearFilters = () => {
    setFilters({});
    setTempFilters({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value);

  // Calculate statistics
  const totalTransactions = transactionsData?.result || 0;
  const totalAmount =
    transactionsData?.transactions.reduce((sum, t) => sum + t.amount, 0) || 0;
  const successfulTransactions =
    transactionsData?.transactions.filter(
      (t) => t.status.toLowerCase() === "success"
    ).length || 0;
  const pendingTransactions =
    transactionsData?.transactions.filter(
      (t) => t.status.toLowerCase() === "pending"
    ).length || 0;
  const failedTransactions =
    transactionsData?.transactions.filter(
      (t) => t.status.toLowerCase() === "failed"
    ).length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-white/50 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-white/50 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/50 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>

          <div className="h-96 bg-white/50 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Transactions
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load transaction data. Please try again.
          </p>
          <Button
            onClick={() => {}}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

          {/* Floating Elements */}
          <div className="absolute top-4 right-4 animate-bounce">
            <Sparkles className="h-6 w-6 text-white/60" />
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse">
            <CreditCard className="h-8 w-8 text-white/40" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">Transaction Management</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Monitor and manage all payment transactions
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {totalTransactions} Total Transactions
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                ${totalAmount.toLocaleString()} Total Value
              </Badge>
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filtered Results
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Transactions */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CreditCard className="h-8 w-8" />
                </div>
                <TrendingUp className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Total Transactions</h3>
              <p className="text-3xl font-bold">{totalTransactions}</p>
              <p className="text-blue-100 text-sm mt-2">All payment records</p>
            </CardContent>
          </Card>

          {/* Total Amount */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <DollarSign className="h-8 w-8" />
                </div>
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Total Amount</h3>
              <p className="text-3xl font-bold">
                ${totalAmount.toLocaleString()}
              </p>
              <p className="text-emerald-100 text-sm mt-2">Revenue generated</p>
            </CardContent>
          </Card>

          {/* Successful Transactions */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <TrendingUp className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Successful</h3>
              <p className="text-3xl font-bold">{successfulTransactions}</p>
              <p className="text-green-100 text-sm mt-2">Completed payments</p>
            </CardContent>
          </Card>

          {/* Failed/Pending Transactions */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-8 w-8" />
                </div>
                <XCircle className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Pending/Failed</h3>
              <p className="text-3xl font-bold">
                {pendingTransactions + failedTransactions}
              </p>
              <p className="text-amber-100 text-sm mt-2">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={tempFilters.phone || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="bg-white/50 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={tempFilters.startDate || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="bg-white/50 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={tempFilters.endDate || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="bg-white/50 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-100">
                <span className="text-sm font-medium text-gray-600">
                  Active Filters:
                </span>
                {filters.phone && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Phone: {filters.phone}
                  </Badge>
                )}
                {filters.startDate && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    From: {format(new Date(filters.startDate), "MMM d, yyyy")}
                  </Badge>
                )}
                {filters.endDate && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    To: {format(new Date(filters.endDate), "MMM d, yyyy")}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Table */}
        <TransactionTable transactions={transactionsData?.transactions || []} />
      </div>
    </div>
  );
};

export default TransactionsPage;
