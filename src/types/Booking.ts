export interface BookingUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  id: string;
}

export interface BookingVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
}

export interface BookingService {
  _id: string;
  service_name: string;
}

export interface Booking {
  _id: string;
  user_id: BookingUser;
  vehicle_id: BookingVehicle;
  service_id: BookingService;
  booking_date: string; // ISO date string
  status: string;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface BookingListResponse {
  status: string; // e.g., "success"
  result: number;
  count: number;
  bookings: Booking[];
}
