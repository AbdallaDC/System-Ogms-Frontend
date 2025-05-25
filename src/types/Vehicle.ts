export interface VehicleOwner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  id: string;
}

export interface Vehicle {
  _id: string;
  owner: VehicleOwner;
  make: string;
  model: string;
  year: number;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface VehicleListResponse {
  status: string; // e.g., "success"
  result: number;
  count: number;
  vehicles: Vehicle[];
}
