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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetch } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { UserListResponse } from "@/types/User";
import { BookingListResponse } from "@/types/Booking";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const formSchema = z.object({
  user_id: z.string().min(1, "Please select a mechanic"),
  booking_id: z.string().min(1, "Please select a booking"),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignFormProps {
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
}

function AssignForm({ onSubmit, onClose }: AssignFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormLabel>Select booking</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedBooking
                          ? selectedBooking.booking_id
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
                            // value={format(
                            //   new Date(booking.booking_date),
                            //   "dd-MM-yyyy"
                            // )}
                            value={booking.booking_id}
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
                            {booking.booking_id}
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

        <Button type="submit" className="w-full">
          Assign
        </Button>
      </form>
    </Form>
  );
}

export default AssignForm;
