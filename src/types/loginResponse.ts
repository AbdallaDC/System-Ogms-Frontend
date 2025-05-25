export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: User;
}
