export interface AssignUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  id: string;
}

export interface AssignVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
}

export interface AssignService {
  _id: string;
  service_name: string;
}

export interface AssignBooking {
  _id: string;
  booking_id: string;
  vehicle_id: AssignVehicle;
  service_id: AssignService;
  booking_date: string; // ISO date string
  status: string;
}

export interface Assign {
  _id: string;
  assign_id: string;
  user_id: AssignUser;
  booking_id: AssignBooking;
  status: string;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  updatedBy: string;
}

export interface AssignListResponse {
  status: string;
  result: number;
  count: number;
  assigns: Assign[];
}
