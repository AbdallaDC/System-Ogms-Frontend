export interface Service {
  _id: string;
  service_name: string;
  description: string;
  price: number;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ServiceListResponse {
  status: string; // e.g., "success"
  result: number;
  count: number;
  services: Service[];
}
