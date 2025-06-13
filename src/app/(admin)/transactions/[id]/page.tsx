"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  User,
  Wrench,
  Receipt,
  Sparkles,
  Settings,
  FileText,
  Hash,
} from "lucide-react";
import { useFetch } from "@/hooks/useApi";

interface TransactionDetailResponse {
  status: string;
  transactions: any; // BookingTransaction | InventoryTransaction
}

const TransactionDetailPage = () => {
  const params = useParams();
  const {
    data: transactionData,
    error,
    isLoading,
  } = useFetch<TransactionDetailResponse>(`/api/v1/payments/${params.id}`);

  if (error || !transactionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction Not Found
          </h2>
          <p className="text-gray-600">
            The transaction you're looking for doesn't exist or has been
            removed.
          </p>
        </Card>
      </div>
    );
  }

  const { transactions: transaction } = transactionData;

  const isBookingTransaction = !!transaction?.service_id;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20" />
          <div className="absolute top-4 right-4 animate-bounce">
            <Sparkles className="h-6 w-6 text-white/60" />
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse">
            <Settings className="h-8 w-8 text-white/40" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Receipt className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    Transaction #{transaction.orderId}
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {format(
                      new Date(transaction.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {getStatusIcon(transaction.status)}
                  <span className="ml-2 capitalize">{transaction.status}</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {transaction.method.toUpperCase()}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  <DollarSign className="h-4 w-4 mr-2" />${transaction.amount}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card className="bg-white/80 shadow-2xl backdrop-blur-sm border-none">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-blue-500" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-bold">
                      {transaction.user_id.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl">
                  <div className="p-3 bg-emerald-500 rounded-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-bold">{transaction.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conditional Transaction Details */}
            <Card className="bg-white/80 shadow-2xl backdrop-blur-sm border-none">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Receipt className="h-6 w-6 text-emerald-500" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                {isBookingTransaction ? (
                  <>
                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl">
                      <div className="p-3 bg-emerald-500 rounded-lg">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="text-lg font-bold">
                          {transaction.service_id.service_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Price</p>
                        <p className="text-lg font-bold">
                          ${transaction.service_id.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl">
                      <div className="p-3 bg-amber-500 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Labour Fee</p>
                        <p className="text-lg font-bold">
                          ${transaction.labour_fee}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-4 p-4 bg-sky-50 rounded-xl md:col-span-2">
                    <div className="p-3 bg-sky-500 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-lg font-bold">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold">${transaction.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Receipt className="h-8 w-8" />
                  </div>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Transaction Status</h3>
                <div className="flex items-center gap-2 mb-4">
                  {getStatusIcon(transaction.status)}
                  <span className="text-xl font-semibold capitalize">
                    {transaction.status}
                  </span>
                </div>
                <p className="text-emerald-100 text-sm">
                  {transaction.responseMessage || "No response message"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 shadow-2xl backdrop-blur-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Transaction Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Transaction ID</span>
                  </div>
                  <Badge variant="outline">{transaction.transactionId}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Paid At</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(new Date(transaction.paid_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Payment Method</span>
                  </div>
                  <span className="text-sm text-gray-600 capitalize">
                    {transaction.method}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Reference ID</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {transaction.referenceId}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
