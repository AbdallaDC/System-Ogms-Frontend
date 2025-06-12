"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useFetch, usePut } from "@/hooks/useApi";
import { format } from "date-fns";
import {
  Calendar,
  Package,
  Clock,
  Pencil,
  Settings,
  Sparkles,
  ArrowRight,
  Activity,
  PenToolIcon as Tool,
  TrendingUp,
  History,
  BarChart3,
  ChevronRight,
  User,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock3,
  DollarSign,
  Hash,
  Layers,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Inventory } from "@/types/Inventory";

interface InventoryItem {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  inventory_id: string;
  __v: number;
}

interface UsedInventoryItem {
  item: string;
  quantity: number;
}

interface TransferHistoryItem {
  from: {
    _id: string;
    name: string;
    user_id: string;
    id: string;
  };
  to: {
    _id: string;
    name: string;
    user_id: string;
    id: string;
  };
  reason: string;
  date: string;
  _id: string;
}

interface InventoryUsage {
  _id: string;
  user_id: string;
  booking_id: string;
  status: string;
  usedInventory: UsedInventoryItem[];
  transferHistory: TransferHistoryItem[];
  createdAt: string;
  updatedAt: string;
  assign_id: string;
  __v: number;
  transferReason?: string;
  transferredBy?: string;
}

interface InventoryDetailResponse {
  status: string;
  totalUsage: number;
  item: InventoryItem;
  inventoryUsage: InventoryUsage[];
}

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
      <div className="container mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-8">
          <div className="h-8 w-64 bg-white/20 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-white/20 mt-2 rounded-lg animate-pulse"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 rounded-2xl bg-white/50 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-2xl bg-white/50 animate-pulse"></div>
            <div className="h-64 rounded-2xl bg-white/50 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryDetailPage = () => {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    quantity: 0,
    unit: "",
    price: 0,
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: inventoryData,
    error,
    isLoading,
  } = useFetch<InventoryDetailResponse>(`/api/v1/inventory/${params.id}`);

  const { putData } = usePut<any, InventoryDetailResponse>(
    `/api/v1/inventory/${params.id}`,
    `/api/v1/inventory/${params.id}`
  );

  // Populate form when data loads
  useEffect(() => {
    if (inventoryData?.item) {
      setEditForm({
        name: inventoryData.item.name,
        type: inventoryData.item.type,
        quantity: inventoryData.item.quantity,
        unit: inventoryData.item.unit,
        price: inventoryData.item.price,
        description: inventoryData.item.description,
      });
    }
  }, [inventoryData]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await putData(editForm);
      toast.success("Inventory item updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "assigned":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "assigned":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "spare-part":
        return "from-blue-500 to-blue-600";
      case "tool":
        return "from-emerald-500 to-emerald-600";
      case "consumable":
        return "from-amber-500 to-amber-600";
      case "equipment":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "spare-part":
        return <Settings className="h-6 w-6" />;
      case "tool":
        return <Tool className="h-6 w-6" />;
      case "consumable":
        return <Package className="h-6 w-6" />;
      case "equipment":
        return <Activity className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !inventoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Item Not Found
          </h2>
          <p className="text-gray-600">
            The inventory item you're looking for doesn't exist or has been
            removed.
          </p>
        </Card>
      </div>
    );
  }

  const { item, inventoryUsage, totalUsage } = inventoryData;

  // Calculate usage statistics
  const statusCounts = inventoryUsage.reduce((acc, usage) => {
    const status = usage.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalQuantityUsed = inventoryUsage.reduce((total, usage) => {
    const itemUsage = usage.usedInventory.find((inv) => inv.item === item._id);
    return total + (itemUsage?.quantity || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  p-6">
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
            <Package className="h-8 w-8 text-white/40" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{item.name}</h1>
                  <p className="text-blue-100 text-lg capitalize">
                    {item.type.replace("-", " ")} - {item.inventory_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge
                  variant="secondary"
                  className={`bg-gradient-to-r ${getTypeColor(
                    item.type
                  )} text-white border-white/30 text-lg px-4 py-2`}
                >
                  {getTypeIcon(item.type)}
                  <span className="ml-2 capitalize">
                    {item.type.replace("-", " ")}
                  </span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {item.quantity} {item.unit} Available
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {totalUsage} Usage Records
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Edit Item
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Item Details & Usage History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Information Card */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 ">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Package className="h-6 w-6 text-blue-500" />
                  Item Information
                </CardTitle>
                <CardDescription>
                  Detailed information about this inventory item
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Item Name
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Layers className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Type
                        </p>
                        <p className="text-lg font-bold text-gray-900 capitalize">
                          {item.type.replace("-", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                      <div className="p-3 bg-emerald-500 rounded-lg">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Quantity Available
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                      <div className="p-3 bg-amber-500 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Unit Price
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${item.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors">
                      <div className="p-3 bg-cyan-500 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Created On
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(item.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                      <div className="p-3 bg-indigo-500 rounded-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Last Updated
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {format(new Date(item.updatedAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    Description
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage History Card */}
            {inventoryUsage && inventoryUsage.length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 ">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <History className="h-6 w-6 text-emerald-500" />
                    Usage History
                    <Badge
                      variant="outline"
                      className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200"
                    >
                      {totalUsage} Records
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Complete history of this item's usage in assignments
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {inventoryUsage.map((usage, index) => (
                      <UsageHistoryItem
                        key={usage._id}
                        usage={usage}
                        item={item}
                        index={index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Usage Statistics */}
            <Card
              className={`overflow-hidden border-none bg-gradient-to-br ${getTypeColor(
                item.type
              )} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {getTypeIcon(item.type)}
                  </div>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Total Usage</h3>
                <p className="text-3xl font-bold">
                  {totalQuantityUsed} {item.unit}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  Used in {totalUsage} assignments
                </p>
              </CardContent>
            </Card>

            {/* Usage Status Overview */}
            {Object.keys(statusCounts).length > 0 && (
              <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Usage Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span className="font-medium capitalize">
                            {status}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {count} of {totalUsage}
                        </span>
                      </div>
                      <Progress
                        value={(count / totalUsage) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Item Value */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <TrendingUp className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Total Value</h3>
                <p className="text-3xl font-bold">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
                <p className="text-indigo-100 text-sm mt-2">
                  {item.quantity} {item.unit} × ${item.price}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tool className="h-5 w-5 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-between bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Item
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Update Stock
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  View All Usage
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  Generate Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Pencil className="h-5 w-5 text-white" />
                </div>
                Edit Inventory Item
              </DialogTitle>
              <DialogDescription>
                Update the information for this inventory item. All fields are
                required.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Item Name
                </Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Enter item name"
                  className="w-full"
                />
              </div>

              {/* Type and Unit Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Item Type
                  </Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spare-part">Spare Part</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium">
                    Unit
                  </Label>
                  <Select
                    value={editForm.unit}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="ltr">Liters (ltr)</SelectItem>
                      <SelectItem value="m">Meters (m)</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="set">Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity Available
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        quantity: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Unit Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter unit price"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Enter item description"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Current Values Display */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-blue-900 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Current Values
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Value:</span>
                    <span className="font-bold ml-2">
                      ${(editForm.quantity * editForm.price).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Inventory ID:</span>
                    <span className="font-bold ml-2">{item?.inventory_id}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={
                  isUpdating ||
                  !editForm.name ||
                  !editForm.type ||
                  !editForm.unit
                }
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Item
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Usage History Item Component
const UsageHistoryItem = ({
  usage,
  item,
  index,
}: {
  usage: InventoryUsage;
  item: InventoryItem;
  index: number;
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "assigned":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "assigned":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "outline";
    }
  };

  const itemUsage = usage.usedInventory.find((inv) => inv.item === item._id);
  const quantityUsed = itemUsage?.quantity || 0;

  return (
    <div
      className={`p-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">
              Assignment {usage.assign_id}
            </h4>
            <p className="text-sm text-gray-500">
              {format(new Date(usage.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        <Badge
          variant={getStatusVariant(usage.status)}
          className="flex items-center gap-1"
        >
          {getStatusIcon(usage.status)}
          {usage.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">
              Quantity Used
            </span>
          </div>
          <p className="font-bold text-gray-900">
            {quantityUsed} {item.unit}
          </p>
          <p className="text-sm text-gray-600">From this assignment</p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">
              Assignment Date
            </span>
          </div>
          <p className="font-bold text-gray-900">
            {format(new Date(usage.createdAt), "MMM d, yyyy")}
          </p>
          <p className="text-sm text-gray-600">
            {format(new Date(usage.createdAt), "h:mm a")}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Booking ID
            </span>
          </div>
          <p className="font-bold text-gray-900 text-sm">{usage.booking_id}</p>
          <p className="text-xs text-gray-500">Related booking</p>
        </div>
      </div>

      {/* Transfer History */}
      {usage.transferHistory && usage.transferHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-amber-500" />
            Transfer History ({usage.transferHistory.length})
          </h5>
          <div className="space-y-2">
            {usage.transferHistory.map((transfer, transferIndex) => (
              <div key={transfer._id} className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${transfer.from.name}`}
                      />
                      <AvatarFallback className="text-xs bg-red-500 text-white">
                        {transfer.from.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {transfer.from.name}
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${transfer.to.name}`}
                      />
                      <AvatarFallback className="text-xs bg-emerald-500 text-white">
                        {transfer.to.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {transfer.to.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(transfer.date), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-8">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {transfer.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          View Assignment
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InventoryDetailPage;
