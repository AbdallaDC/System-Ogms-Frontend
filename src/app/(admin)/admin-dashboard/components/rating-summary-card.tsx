"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Star,
  MessageSquare,
  Award,
  ChevronRight,
  Search,
  SortDesc,
  SortAsc,
} from "lucide-react";
import { useFetch } from "@/hooks/useApi";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface RatingSummary {
  _id: string;
  feedbackCount: number;
  avgRating: number;
  serviceName: string;
}

interface RatingSummaryResponse {
  status: string;
  summary: RatingSummary[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const RatingBar = ({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating?: number;
}) => {
  const percentage = (rating / maxRating) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export function RatingSummaryCard() {
  const { data, isLoading, error } = useFetch<RatingSummaryResponse>(
    "/api/v1/feedback/summary/service"
  );

  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "highest" | "lowest" | "most-reviews"
  >("highest");

  if (isLoading) {
    return (
      <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 ">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Service Ratings Summary
          </CardTitle>
          <CardDescription>Loading rating data...</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.summary) {
    return (
      <Card className="border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Star className="h-5 w-5" />
            Service Ratings Summary
          </CardTitle>
          <CardDescription className="text-red-500">
            Failed to load rating data
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculate overall stats from ALL services
  const totalFeedback = data.summary.reduce(
    (sum, service) => sum + service.feedbackCount,
    0
  );
  const overallAvgRating =
    data.summary.length > 0
      ? data.summary.reduce(
          (sum, service) => sum + service.avgRating * service.feedbackCount,
          0
        ) / totalFeedback
      : 0;

  // Sort services by rating (highest first) and take top 3
  const topRatedServices = [...data.summary]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);

  // Filter and sort all services for the modal
  const filteredAndSortedServices = [...data.summary]
    .filter((service) =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "highest") return b.avgRating - a.avgRating;
      if (sortOrder === "lowest") return a.avgRating - b.avgRating;
      return b.feedbackCount - a.feedbackCount; // most-reviews
    });
  return (
    <>
      <Card className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 ">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Service Ratings Summary
          </CardTitle>
          <CardDescription>
            Overall statistics from all services with top-rated highlights
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Overall Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50  rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-900 ">
                  {overallAvgRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 ">Overall Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 ">
                  {totalFeedback}
                </span>
              </div>
              <p className="text-sm text-gray-600 ">Total Reviews</p>
            </div>
          </div>

          {/* Top Rated Services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 ">
                <span className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  Top Rated Services
                </span>
              </h4>
              <Button
                variant={"link"}
                className="text-sm text-blue-600 hover:text-blue-800  flex items-center"
                onClick={() => setIsAllServicesModalOpen(true)}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {topRatedServices.length > 0 ? (
              topRatedServices.map((service, index) => (
                <div
                  key={service._id}
                  className={`p-4 border border-gray-200  rounded-lg hover:bg-gray-50  transition-colors duration-200 ${
                    index === 0 ? "bg-yellow-50  border-yellow-200" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900  mb-1">
                          {service.serviceName}
                        </h5>
                        {index === 0 && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            Top Rated
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <StarRating rating={service.avgRating} />
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {service.feedbackCount} review
                          {service.feedbackCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <RatingBar rating={service.avgRating} />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 ">
                  No service ratings available yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Services Modal */}
      <Dialog
        open={isAllServicesModalOpen}
        onOpenChange={setIsAllServicesModalOpen}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5 text-yellow-500" />
              All Service Ratings
            </DialogTitle>
            <DialogDescription>
              Showing all {filteredAndSortedServices.length} services with
              ratings
            </DialogDescription>
          </DialogHeader>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  {sortOrder === "highest" && (
                    <SortDesc className="mr-2 h-4 w-4" />
                  )}
                  {sortOrder === "lowest" && (
                    <SortAsc className="mr-2 h-4 w-4" />
                  )}
                  {sortOrder === "most-reviews" && (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  {sortOrder === "highest" && "Highest Rated"}
                  {sortOrder === "lowest" && "Lowest Rated"}
                  {sortOrder === "most-reviews" && "Most Reviews"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("highest")}>
                  <SortDesc className="mr-2 h-4 w-4" />
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("lowest")}>
                  <SortAsc className="mr-2 h-4 w-4" />
                  Lowest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("most-reviews")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Most Reviews
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Services List */}
          <div className="space-y-4 mt-4">
            {filteredAndSortedServices.length > 0 ? (
              filteredAndSortedServices.map((service, index) => (
                <div
                  key={service._id}
                  className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                    sortOrder === "highest" && index === 0
                      ? "bg-yellow-50  border-yellow-200 "
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900 mb-1">
                          {service.serviceName}
                        </h5>
                        {sortOrder === "highest" && index === 0 && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            Top Rated
                          </span>
                        )}
                        {sortOrder === "lowest" && index === 0 && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            Needs Improvement
                          </span>
                        )}
                        {sortOrder === "most-reviews" && index === 0 && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            Most Reviewed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <StarRating rating={service.avgRating} />
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {service.feedbackCount} review
                          {service.feedbackCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <RatingBar rating={service.avgRating} />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No matching services found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
