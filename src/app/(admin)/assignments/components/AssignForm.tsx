"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
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
import type { UserListResponse } from "@/types/User";
import type { BookingListResponse } from "@/types/Booking";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { InventoryListResponse } from "@/types/Inventory";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  user_id: z.string().min(1, "Please select a mechanic"),
  booking_id: z.string().min(1, "Please select a booking"),
  usedInventory: z
    .array(
      z.object({
        item: z.string().min(1, "Please select an inventory item"),
        quantity: z.coerce
          .number({ invalid_type_error: "Quantity must be a number" })
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Please add at least one inventory item"),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignFormProps {
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
}

function AssignForm({ onSubmit, onClose }: AssignFormProps) {
  const [userOpen, setUserOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState<boolean[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      booking_id: "",
      usedInventory: [], // start with no items selected
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "usedInventory",
  });

  const {
    data: userData,
    error: userError,
    isLoading: isLoadingUsers,
  } = useFetch<UserListResponse>("/api/v1/users/role/mechanic");

  const {
    data: inventoryData,
    error: inventoryError,
    isLoading: isLoadingInventory,
  } = useFetch<InventoryListResponse>("/api/v1/inventory");
  console.log("inventoryData", inventoryData);

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
            const selectedUser = userData?.users.find(
              (user) => user._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>Mechanic</FormLabel>
                <Popover open={userOpen} onOpenChange={setUserOpen}>
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
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {userData?.users.map((user) => (
                          <CommandItem
                            key={user._id}
                            value={user.name}
                            onSelect={() => {
                              field.onChange(user._id);
                              setUserOpen(false);
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
            const selectedBooking = bookingData?.bookings.find(
              (booking) => booking._id === field.value
            );
            return (
              <FormItem>
                <FormLabel>Select booking</FormLabel>
                <Popover open={bookingOpen} onOpenChange={setBookingOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedBooking
                          ? selectedBooking.booking_id
                          : "Select a booking"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search booking ID..." />
                      <CommandList>
                        <CommandEmpty>No booking found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {bookingData?.bookings.map((booking) => (
                            <CommandItem
                              key={booking._id}
                              value={booking.booking_id}
                              onSelect={() => {
                                field.onChange(booking._id);
                                setBookingOpen(false);
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
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Inventory Items Selection */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex justify-center items-center gap-4"
          >
            {/* Inventory item dropdown */}
            <FormField
              control={form.control}
              name={`usedInventory.${index}.item`}
              render={({ field: itemField }) => {
                // Initialize inventoryOpen state if needed
                if (inventoryOpen.length !== fields.length) {
                  setInventoryOpen((prev) => {
                    const newArray = [...prev];
                    newArray[index] = false;
                    return newArray;
                  });
                }

                const selectedInv = inventoryData?.items.find(
                  (inv) => inv._id === itemField.value
                );
                return (
                  <FormItem className="flex-1">
                    <FormLabel>Item</FormLabel>
                    <Popover
                      open={inventoryOpen[index] || false}
                      onOpenChange={(open) => {
                        const newInventoryOpen = [...inventoryOpen];
                        newInventoryOpen[index] = open;
                        setInventoryOpen(newInventoryOpen);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedInv ? selectedInv.name : "Select an item"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search items..." />
                          <CommandEmpty>No item found.</CommandEmpty>
                          <CommandGroup>
                            {inventoryData?.items.map((inv) => (
                              <CommandItem
                                key={inv._id}
                                value={inv.name}
                                onSelect={() => {
                                  itemField.onChange(inv._id); // set selected inventory ID
                                  const newInventoryOpen = [...inventoryOpen];
                                  newInventoryOpen[index] = false;
                                  setInventoryOpen(newInventoryOpen);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    inv._id === itemField.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {inv.name}
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

            {/* Quantity input */}
            <FormField
              control={form.control}
              name={`usedInventory.${index}.quantity`}
              render={({ field: qtyField }) => (
                <FormItem className="w-24">
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    {/* Use a numeric input for quantity */}
                    <Input
                      type="number"
                      min={1}
                      className="input w-full" /* assuming a basic input style or use Input component if available */
                      {...qtyField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remove button */}
            <Button
              type="button"
              variant="destructive"
              size={"sm"}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        {/* Button to add a new inventory field */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ item: "", quantity: 1 })}
        >
          + Add Item
        </Button>

        <Button type="submit" className="w-full">
          Assign
        </Button>
      </form>
    </Form>
  );
}

export default AssignForm;
