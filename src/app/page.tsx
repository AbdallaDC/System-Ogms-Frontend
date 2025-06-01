"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import { LoginResponse } from "@/types/loginResponse";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/getUser";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type LoginType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { user, token } = getUser();

  const router = useRouter();
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { postData: login } = usePost<any, any>("/api/v1/auth/login");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user && token) {
      if (user.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/customer-dashboard");
      }
    }
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(formData);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      console.log(res.user.role);
      if (res.user.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/customer-dashboard");
      }
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log("error", error.response.data.message);

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to Garage</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-2 text-muted-foreground cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-3">
            <Button
              type="submit"
              className="w-full bg-primary cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            {/* <div className="text-xs text-muted-foreground text-center w-full">
              Forgot your password?{" "}
              <a href="#" className="underline">
                Reset it
              </a>
            </div> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
