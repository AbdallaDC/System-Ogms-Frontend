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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  ArrowLeft,
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
  Download,
  RefreshCw,
  Sparkles,
  Settings,
  FileText,
  Hash,
} from "lucide-react";
import { useFetch } from "@/hooks/useApi";

interface TransactionDetailResponse {
  status: string;
  transactions: {
    _id: string;
    orderId: string;
    issuerTransactionId: string;
    accountType: string;
    payment_id: string;
    user_id: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      user_id: string;
      id: string;
    };
    service_id: {
      _id: string;
      service_name: string;
      price: number;
      service_id: string;
      id: string;
    };
    booking_id: {
      _id: string;
      service_id: string;
      status: string;
      booking_date: string;
    };
    phone: string;
    method: string;
    item_price: number;
    labour_fee: number;
    amount: number;
    status: string;
    referenceId: string;
    transactionId: string;
    responseMessage: string;
    paid_at: string;
    createdAt: string;
    updatedAt: string;
  };
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
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

          {/* Floating Elements */}
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

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-blue-500" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Details about the customer who made this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Email Address
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {transaction.user_id.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                    <div className="p-3 bg-emerald-500 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Phone Number
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {transaction.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Receipt className="h-6 w-6 text-emerald-500" />
                  Transaction Details
                </CardTitle>
                <CardDescription>
                  Detailed information about this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                    <div className="p-3 bg-emerald-500 rounded-lg">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Service
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {transaction.service_id.service_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Service Price
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${transaction.service_id.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                    <div className="p-3 bg-amber-500 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Labour Fee
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${transaction.labour_fee}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Total Amount
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${transaction.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6">
            {/* Transaction Status Card */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
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
                  {transaction.responseMessage}
                </p>
              </CardContent>
            </Card>

            {/* Transaction Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
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
