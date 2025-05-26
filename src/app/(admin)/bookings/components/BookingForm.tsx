"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { ServiceListResponse } from "@/types/Service";
import { UserListResponse } from "@/types/User";
import { VehicleListResponse } from "@/types/Vehicle";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface BookingFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

function BookingForm({ onSubmit, onClose }: BookingFormProps) {
  const form = useForm({
    defaultValues: {
      user_id: "",
      vehicle_id: "",
      service_id: "",
      booking_date: new Date(),
      status: "pending",
    },
  });

  const {
    data: userData,
    error: userError,
    isLoading: isLoadingUsers,
  } = useFetch<UserListResponse>("/api/v1/users/role/customer");

  const {
    data: vehicleData,
    error: vehicleError,
    isLoading: isLoadingVehicles,
  } = useFetch<VehicleListResponse>("/api/v1/vehicles");

  const {
    data: serviceData,
    error: serviceError,
    isLoading: isLoadingServices,
  } = useFetch<ServiceListResponse>("/api/v1/services");

  if (isLoadingUsers || isLoadingVehicles || isLoadingServices) {
    return <div>Loading booking form...</div>;
  }

  if (userError || vehicleError || serviceError) {
    return <div className="text-red-500">Error loading booking form data.</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>Customer</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedUser ? selectedUser.name : "Select a customer"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search customers..." />
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {userData?.users.map((user) => (
                          <CommandItem
                            key={user._id}
                            value={user.name}
                            onSelect={() => {
                              field.onChange(user._id);
                              setOpen(false); // close on select
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
              (v) => v._id === field.value
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
                              setOpen(false);
                              field.onChange(vehicle._id);
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
                            {`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
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
              (s) => s._id === field.value
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
                        {selectedService?.service_name || "Select a service"}
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
                              setOpen(false);
                              field.onChange(service._id);
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
          name="booking_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Booking Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Booking</Button>
        </div>
      </form>
    </Form>
  );
}

export default BookingForm;
