"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface ForgotPasswordFormProps {
  onSubmit: (data: { password: string }) => void;
  onClose: () => void;
  userEmail: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onClose,
  userEmail,
}) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const form = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
      setIsEmailVerified(true);
      setEmailError("");
    } else {
      setIsEmailVerified(false);
      setEmailError("Email does not match our records.");
    }
  };

  const handleSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    onSubmit({ password: values.password });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleVerifyEmail} className="space-y-2 mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
          disabled={isEmailVerified}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
        {!isEmailVerified && (
          <Button type="submit" className="w-full">
            Verify
          </Button>
        )}
      </form>
      {isEmailVerified && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      required
                      minLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                      required
                      minLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Reset Password</Button>
            </div>
          </form>
        </Form>
      )}
      {!isEmailVerified && (
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
