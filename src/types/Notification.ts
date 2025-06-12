export interface Notification {
  _id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  link: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  notification_id: string;
  __v: number;
}

export interface NotificationListResponse {
  status: string;
  result: number;
  notifications: Notification[];
}
