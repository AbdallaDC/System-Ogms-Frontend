"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/types/Booking";
import { useFetch } from "@/hooks/useApi";
import { UserListResponse } from "@/types/User";
import { ServiceListResponse } from "@/types/Service";
import { VehicleListResponse } from "@/types/Vehicle";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  user_id: z.string().min(1, "Please select a user"),
  vehicle_id: z.string().min(1, "Please select a vehicle"),
  service_id: z.string().min(1, "Please select a service"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateBookingFormProps {
  onSubmit: (values: Booking) => void;
  onClose: () => void;
  initialData: Booking;
}

function UpdateBookingForm({ onSubmit, onClose, initialData }: any) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: initialData.user_id?._id,
      vehicle_id: initialData.vehicle_id?._id,
      service_id: initialData.service_id?._id,
      status: initialData.status as "pending" | "completed" | "cancelled",
    },
  });

  const {
    data: userData,
    error: userError,
    isLoading: isLoadingUsers,
  } = useFetch<UserListResponse>("/api/v1/users");

  const {
    data: serviceData,
    error: serviceError,
    isLoading: isLoadingServices,
  } = useFetch<ServiceListResponse>("/api/v1/services");

  const {
    data: vehicleData,
    error: vehicleError,
    isLoading: isLoadingVehicles,
  } = useFetch<VehicleListResponse>("/api/v1/vehicles");

  const handleSubmit = (values: FormValues) => {
    const selectedUser = userData?.users.find(
      (user) => user._id === values.user_id
    );
    const selectedVehicle = vehicleData?.vehicles.find(
      (vehicle) => vehicle._id === values.vehicle_id
    );
    const selectedService = serviceData?.services.find(
      (service) => service._id === values.service_id
    );

    if (!selectedUser || !selectedVehicle || !selectedService) {
      return;
    }

    onSubmit({
      ...initialData,
      user_id: {
        _id: selectedUser._id,
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        id: selectedUser._id,
      },
      vehicle_id: {
        _id: selectedVehicle._id,
        make: selectedVehicle.make,
        model: selectedVehicle.model,
        year: selectedVehicle.year,
      },
      service_id: {
        _id: selectedService._id,
        service_name: selectedService.service_name,
      },
      status: values.status,
    });
  };

  if (isLoadingUsers || isLoadingServices || isLoadingVehicles) {
    return <div>Loading form data...</div>;
  }

  if (userError || serviceError || vehicleError) {
    return <div className="text-red-500">Error loading form data.</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            const selectedUser = userData?.users.find(
              (user) => user._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedUser ? selectedUser.name : "Select a user"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {userData?.users.map((user) => (
                          <CommandItem
                            key={user._id}
                            value={user.name}
                            onSelect={() => {
                              field.onChange(user._id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                user._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="vehicle_id"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            const selectedVehicle = vehicleData?.vehicles.find(
              (vehicle) => vehicle._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedVehicle
                          ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                          : "Select a vehicle"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vehicles..." />
                      <CommandEmpty>No vehicle found.</CommandEmpty>
                      <CommandGroup>
                        {vehicleData?.vehicles.map((vehicle) => (
                          <CommandItem
                            key={vehicle._id}
                            value={`${vehicle.make} ${vehicle.model}`}
                            onSelect={() => {
                              field.onChange(vehicle._id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                vehicle._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="service_id"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            const selectedService = serviceData?.services.find(
              (service) => service._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedService
                          ? selectedService.service_name
                          : "Select a service"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search services..." />
                      <CommandEmpty>No service found.</CommandEmpty>
                      <CommandGroup>
                        {serviceData?.services.map((service) => (
                          <CommandItem
                            key={service._id}
                            value={service.service_name}
                            onSelect={() => {
                              field.onChange(service._id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                service._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {service.service_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>

                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Update Booking</Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateBookingForm;
