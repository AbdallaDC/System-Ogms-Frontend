// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Eye, EyeOff } from "lucide-react";
// import { usePost } from "@/hooks/useApi";
// import { LoginResponse } from "@/types/loginResponse";
// import { useRouter } from "next/navigation";
// import { getUser } from "@/utils/getUser";
// import toast from "react-hot-toast";
// import { AxiosError } from "axios";

// type LoginType = {
//   email: string;
//   password: string;
// };

// const LoginPage = () => {
//   const { user, token } = getUser();

//   const router = useRouter();
//   const [formData, setFormData] = useState<LoginType>({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { postData: login } = usePost<any, any>("/api/v1/auth/login");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     if (user && token) {
//       if (user.role === "admin") {
//         router.push("/admin-dashboard");
//       } else {
//         router.push("/customer-dashboard");
//       }
//     }
//   }, [user, token, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await login(formData);
//       localStorage.setItem("token", res.token);
//       localStorage.setItem("user", JSON.stringify(res.user));
//       console.log(res.user.role);
//       if (res.user.role === "admin") {
//         router.push("/admin-dashboard");
//       } else {
//         router.push("/customer-dashboard");
//       }
//       toast.success("Login successful");
//     } catch (error: any) {
//       toast.error(error.response.data.message);
//       console.log("error", error.response.data.message);

//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl">Sign in to Garage</CardTitle>
//           <CardDescription>
//             Enter your credentials to access the dashboard.
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//                 <button
//                   type="button"
//                   tabIndex={-1}
//                   className="absolute right-2 top-2 text-muted-foreground cursor-pointer"
//                   onClick={() => setShowPassword((v) => !v)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             {error && <div className="text-destructive text-sm">{error}</div>}
//           </CardContent>
//           <CardFooter className="flex flex-col gap-2 mt-3">
//             <Button
//               type="submit"
//               className="w-full bg-primary cursor-pointer"
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//             {/* <div className="text-xs text-muted-foreground text-center w-full">
//               Forgot your password?{" "}
//               <a href="#" className="underline">
//                 Reset it
//               </a>
//             </div> */}
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default LoginPage;

"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Eye, EyeOff, Car, Wrench, Settings, Zap } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/getUser";
import toast from "react-hot-toast";

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Car className="absolute top-20 left-10 w-8 h-8 text-white/20 animate-float" />
        <Wrench className="absolute top-40 right-20 w-6 h-6 text-white/20 animate-float animation-delay-1000" />
        <Settings className="absolute bottom-40 left-20 w-7 h-7 text-white/20 animate-float animation-delay-2000" />
        <Zap className="absolute bottom-20 right-10 w-5 h-5 text-white/20 animate-float animation-delay-3000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Garage Pro
            </h1>
            <p className="text-gray-300 text-lg">Professional Auto Care</p>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl animate-slide-up">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Sign in to access your garage dashboard
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500 transition-all duration-300 h-12 pl-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500 transition-all duration-300 h-12 pl-4 pr-12"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {/* Forgot your password? */}
                  </a>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm animate-fade-in animation-delay-500">
            <p>© {new Date().getFullYear()} Garage Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
