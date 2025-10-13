import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Eye, EyeOff } from "lucide-react";
import loginEmployee from "@/instructor/Redux/Api/LoginApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAccessControls, setToken } from "@/instructor/Redux/Slice/LogoutEmployeeSlice";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";

const FormSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const EmployeeLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError("");

    try {
      const result = await tryCatchWrapper(() =>
        dispatch(loginEmployee(data)).unwrap()
      );

      if (result.success) {
        const response = result.data;

        if (response?.success && response?.data?.token) {
          dispatch(setToken(response.data.token));
          dispatch(setAccessControls(response.data.accessControls));
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("accessControls", JSON.stringify(response.data.accessControls));
          toast.success(response.message || "Login successful");
          navigate("/Dashboard");
        } else {
          const msg = response?.message || "Login failed. Please try again.";
          setApiError(msg);
        }
      } else {
        setApiError(result.error);
      }
    } finally {
      // ✅ This ensures it's always reset
      setIsSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Left Side Welcome Message */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-700 to-blue-700 items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-30"></div>
        <div className="text-center text-white z-10 animate-slideUp">
          <h2 className="text-5xl font-bold">Intellix Master Portal</h2>
          <p className="mt-6 text-lg opacity-90 max-w-md mx-auto">
            Empowering education with seamless access to your school's
            management system.
          </p>
          <div className="mt-12">
            <svg className="w-36 h-36 mx-auto opacity-90 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/30 animate-fadeIn">
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Employee Login
            </h3>
            <p className="text-sm text-gray-600 mt-3 font-medium">
              Sign in with your credentials to access the portal
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-10 space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          {...field}
                          className="w-full px-4 py-3 text-gray-900 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 shadow-sm placeholder-gray-400"
                          placeholder="Enter your email"
                          type="email"
                        />
                        <span className="absolute right-4 text-gray-500">
                          <Mail size={20} />
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          {...field}
                          className="w-full px-4 py-3 text-gray-900 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 shadow-sm placeholder-gray-400"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                        />
                        <span
                          className="absolute right-4 text-gray-500 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                    {/* 👇 API Error Below Password */}
                    {apiError && (
                      <p className="text-red-500 text-sm font-medium mt-1">
                        {apiError}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex justify-end -mt-4">
                <Link
                  to="/Forgetpassword"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold text-sm shadow-md"
              >
                {isSubmitting ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
