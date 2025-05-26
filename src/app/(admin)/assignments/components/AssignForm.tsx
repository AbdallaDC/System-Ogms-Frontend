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
import { BookingListResponse } from "@/types/Booking";

interface AssignFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

function AssignForm({ onSubmit, onClose }: AssignFormProps) {
  const form = useForm({
    defaultValues: {
      user_id: "",
      booking_id: "",
    },
  });

  const {
    data: userData,
    error: userError,
    isLoading: isLoadingUsers,
  } = useFetch<UserListResponse>("/api/v1/users/role/mechanic");

  const {
    data: bookingData,
    error: bookingError,
    isLoading: isLoadingBookings,
  } = useFetch<BookingListResponse>("/api/v1/bookings/unassigned/bookings");

  if (isLoadingUsers || isLoadingBookings) {
    return <div>Loading assign form...</div>;
  }

  if (userError || bookingError) {
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
          name="booking_id"
          render={({ field }) => {
            const [open, setOpen] = useState(false);

            const selectService = bookingData?.bookings.find(
              (v) => v._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>Select booking</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectService
                          ? `${format(
                              new Date(selectService.booking_date),
                              "yyyy-MM-dd"
                            )}`
                          : "Select a booking date"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search booking date..." />
                      <CommandEmpty>No booking date found.</CommandEmpty>
                      <CommandGroup>
                        {bookingData?.bookings.map((booking) => (
                          <CommandItem
                            key={booking._id}
                            value={`${format(
                              new Date(booking.booking_date),
                              "yyyy-MM-dd"
                            )}`}
                            onSelect={() => {
                              setOpen(false);
                              field.onChange(booking._id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                booking._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {`${format(
                              new Date(booking.booking_date),
                              "yyyy-MM-dd"
                            )}`}
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Assign</Button>
        </div>
      </form>
    </Form>
  );
}

export default AssignForm;
