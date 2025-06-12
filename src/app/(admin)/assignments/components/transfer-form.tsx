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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useFetch, usePut } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import type { UserListResponse } from "@/types/User";
import { Check, ChevronsUpDown, UserCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  new_user_id: z.string().min(1, "Please select a user to transfer to"),
  reason: z.string().min(1, "Please provide a reason for transfer"),
});

type FormValues = z.infer<typeof formSchema>;

interface TransferFormProps {
  assignId: string;
  currentUserId: string;
  currentUserName: string;
  //   onSubmit: (values: FormValues) => void;
  onClose: () => void;
}

function TransferForm({
  assignId,
  currentUserId,
  currentUserName,
  //   onSubmit,
  onClose,
}: TransferFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_user_id: "",
      reason: "",
    },
  });

  const {
    data: userData,
    error: userError,
    isLoading: isLoadingUsers,
  } = useFetch<UserListResponse>("/api/v1/users/role/mechanic");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  //   const handleSubmit = async (values: FormValues) => {
  //     setIsSubmitting(true);
  //     try {
  //       await onSubmit(values);
  //       form.reset();
  //       onClose();
  //       toast.success("Assignment transferred successfully!");
  //     } catch (error) {
  //       console.error("Transfer error:", error);
  //       toast.error("Failed to transfer assignment");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };
  const { putData } = usePut(`/api/v1/assigns/${assignId}/transfer`);
  const handleSubmit = async (values: {
    new_user_id: string;
    reason: string;
  }) => {
    if (!currentUserId) return;

    try {
      await putData(values);
      toast.success("Assignment transferred successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error transferring assignment:", error);
      toast.error(
        error.response?.data?.message || "Failed to transfer assignment"
      );
    }
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (userError) {
    return <div className="text-red-500 p-4">Error loading users data.</div>;
  }

  // Filter out the current user from the list
  const availableUsers =
    userData?.users.filter((user) => user._id !== currentUserId) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Transfer Assignment
          </h3>
          <p className="text-sm text-gray-600">
            Transfer from <span className="font-medium">{currentUserName}</span>{" "}
            to another mechanic
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="new_user_id"
            render={({ field }) => {
              const selectedUser = availableUsers.find(
                (user) => user._id === field.value
              );
              return (
                <FormItem>
                  <FormLabel>Transfer To</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {selectedUser
                            ? selectedUser.name
                            : "Select a mechanic"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search mechanics..." />
                        <CommandList>
                          <CommandEmpty>No mechanic found.</CommandEmpty>
                          <CommandGroup>
                            {availableUsers.map((user) => (
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
                                <div className="flex flex-col">
                                  <span>{user.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {user.email}
                                  </span>
                                </div>
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

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transfer Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide a reason for this transfer..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Transferring...
                </>
              ) : (
                "Transfer Assignment"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default TransferForm;
