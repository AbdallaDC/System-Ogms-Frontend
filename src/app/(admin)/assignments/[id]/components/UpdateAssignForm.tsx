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
import { useFetch } from "@/hooks/useApi";
import { UserListResponse } from "@/types/User";
import { BookingListResponse } from "@/types/Booking";
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
import { format } from "date-fns";

const formSchema = z.object({
  user_id: z.string().min(1, "Please select a mechanic"),
  booking_id: z.string().min(1, "Please select a booking"),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
});

type FormValues = z.infer<typeof formSchema>;

interface Assign {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    id: string;
  };
  booking_id: {
    _id: string;
    vehicle_id: {
      _id: string;
      make: string;
      model: string;
      year: number;
    };
    service_id: {
      _id: string;
      service_name: string;
    };
    booking_date: string;
    status: string;
  };
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateAssignFormProps {
  onSubmit: (values: Assign) => void;
  onClose: () => void;
  initialData: Assign;
}

function UpdateAssignForm({ onSubmit, onClose, initialData }: any) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: initialData.user_id?._id,
      booking_id: initialData.booking_id?._id,
      status: initialData.status as "pending" | "completed" | "cancelled",
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
  } = useFetch<BookingListResponse>("/api/v1/bookings");

  const handleSubmit = (values: FormValues) => {
    const selectedUser = userData?.users.find(
      (user) => user._id === values.user_id
    );
    const selectedBooking = bookingData?.bookings.find(
      (booking) => booking._id === values.booking_id
    );

    if (!selectedUser || !selectedBooking) {
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
      booking_id: selectedBooking,
      status: values.status,
    });
  };

  if (isLoadingUsers || isLoadingBookings) {
    return <div>Loading form data...</div>;
  }

  if (userError || bookingError) {
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
                <FormLabel>Mechanic</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedUser ? selectedUser.name : "Select a mechanic"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search mechanics..." />
                      <CommandEmpty>No mechanic found.</CommandEmpty>
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
          name="booking_id"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            const selectedBooking = bookingData?.bookings.find(
              (booking) => booking._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>Booking</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedBooking
                          ? `${selectedBooking.vehicle_id.make} ${
                              selectedBooking.vehicle_id.model
                            } - ${format(
                              new Date(selectedBooking.booking_date),
                              "MMM dd, yyyy"
                            )}`
                          : "Select a booking"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search bookings..." />
                      <CommandEmpty>No booking found.</CommandEmpty>
                      <CommandGroup>
                        {bookingData?.bookings.map((booking) => (
                          <CommandItem
                            key={booking._id}
                            value={`${booking.vehicle_id.make} ${booking.vehicle_id.model}`}
                            onSelect={() => {
                              field.onChange(booking._id);
                              setOpen(false);
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
                            {booking.vehicle_id.make} {booking.vehicle_id.model}{" "}
                            -{" "}
                            {format(
                              new Date(booking.booking_date),
                              "MMM dd, yyyy"
                            )}
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
                  <SelectItem value="in-progress">In Progress</SelectItem>
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
          <Button type="submit">Update Assignment</Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateAssignForm;
