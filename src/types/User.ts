export interface User {
  _id: string;
  name: string;
  email: string;
  is_active: boolean;
  phone: string;
  role: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: string;
}

export interface UserListResponse {
  status: string; // e.g., "success"
  result: number;
  count: number;
  users: User[];
}
