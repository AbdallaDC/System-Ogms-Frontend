// "use client";

// import { formatDistanceToNow } from "date-fns";
// import {
//   AlertCircle,
//   Info,
//   CheckCircle,
//   XCircle,
//   ExternalLink,
// } from "lucide-react";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import type { Notification } from "@/types/Notification";

// interface NotificationItemProps {
//   notification: Notification;
// }

// export function NotificationItem({ notification }: NotificationItemProps) {
//   const getTypeIcon = (type: string) => {
//     switch (type) {
//       case "info":
//         return <Info className="h-4 w-4 text-blue-500" />;
//       case "warning":
//         return <AlertCircle className="h-4 w-4 text-amber-500" />;
//       case "success":
//         return <CheckCircle className="h-4 w-4 text-emerald-500" />;
//       case "error":
//         return <XCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return <Info className="h-4 w-4 text-blue-500" />;
//     }
//   };

//   const getTypeBg = (type: string) => {
//     switch (type) {
//       case "info":
//         return "bg-blue-50 border-blue-200";
//       case "warning":
//         return "bg-amber-50 border-amber-200";
//       case "success":
//         return "bg-emerald-50 border-emerald-200";
//       case "error":
//         return "bg-red-50 border-red-200";
//       default:
//         return "bg-blue-50 border-blue-200";
//     }
//   };

//   return (
//     <Link href={notification.link} className="block">
//       <div
//         className={cn(
//           "p-3 rounded-lg transition-all duration-200 hover:shadow-md border",
//           getTypeBg(notification.type),
//           !notification.seen && "ring-2 ring-blue-200 ring-opacity-50"
//         )}
//       >
//         <div className="flex items-start gap-3">
//           <div className="flex-shrink-0 mt-0.5">
//             {getTypeIcon(notification.type)}
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="flex items-center justify-between mb-1">
//               <h4 className="text-sm font-medium text-gray-900 capitalize">
//                 {notification.title}
//               </h4>
//               {!notification.seen && (
//                 <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
//               )}
//             </div>

//             <p className="text-xs text-gray-600 mb-2 line-clamp-2">
//               {notification.message}
//             </p>

//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-500">
//                 {formatDistanceToNow(new Date(notification.createdAt), {
//                   addSuffix: true,
//                 })}
//               </span>
//               <ExternalLink className="h-3 w-3 text-gray-400" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

"use client";

import type React from "react";

import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  ExternalLink,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/Notification";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import toast from "react-hot-toast";
import { getUser } from "@/utils/getUser";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: () => void;
  showMarkAsRead?: boolean;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  showMarkAsRead = false,
}: NotificationItemProps) {
  const token = getUser()?.token;
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeBg = (type: string, seen: boolean) => {
    const baseClasses = seen ? "opacity-60" : "";
    switch (type) {
      case "info":
        return `bg-blue-50 border-blue-200 ${baseClasses}`;
      case "warning":
        return `bg-amber-50 border-amber-200 ${baseClasses}`;
      case "success":
        return `bg-emerald-50 border-emerald-200 ${baseClasses}`;
      case "error":
        return `bg-red-50 border-red-200 ${baseClasses}`;
      default:
        return `bg-blue-50 border-blue-200 ${baseClasses}`;
    }
  };

  const markAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/notifications/${notification._id}/seen`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok && onMarkAsRead) {
        onMarkAsRead();
      } else {
        toast.error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="relative group">
      <Link href={notification.link} className="block">
        <div
          className={cn(
            "p-3 rounded-lg transition-all duration-200 hover:shadow-md border",
            getTypeBg(notification.type, notification.seen),
            !notification.seen && "ring-2 ring-blue-200 ring-opacity-50"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getTypeIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={cn(
                    "text-sm font-medium capitalize",
                    notification.seen ? "text-gray-600" : "text-gray-900"
                  )}
                >
                  {notification.title}
                </h4>
                <div className="flex items-center gap-2">
                  {!notification.seen && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                  {showMarkAsRead && !notification.seen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAsRead}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100"
                    >
                      <Check className="h-3 w-3 text-blue-600" />
                    </Button>
                  )}
                </div>
              </div>

              <p
                className={cn(
                  "text-xs mb-2 line-clamp-2",
                  notification.seen ? "text-gray-500" : "text-gray-600"
                )}
              >
                {notification.message}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
