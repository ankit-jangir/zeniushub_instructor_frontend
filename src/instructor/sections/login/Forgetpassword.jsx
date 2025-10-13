import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff } from "lucide-react";

// Step-wise schemas
const emailSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

const otpSchema = emailSchema.extend({
  otp: z.string().min(4, "Enter valid OTP"),
});

const passwordSchema = otpSchema.extend({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpExpired(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  const getSchema = () => {
    if (step === 1) return emailSchema;
    if (step === 2) return otpSchema;
    return passwordSchema;
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
    },
  });

  const handleEmail = async () => {
    const valid = await form.trigger("email");
    if (!valid) return;
    console.log("OTP sent to:", form.getValues("email"));
    setOtpTimer(30);
    setOtpExpired(false);
    setStep(2);
  };

  const handleOtp = async () => {
    if (otpExpired) {
      form.setError("otp", { message: "OTP expired. Please resend." });
      return;
    }
    const valid = await form.trigger("otp");
    if (!valid) return;
    console.log("Verifying OTP:", form.getValues("otp"));
    setStep(3);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    console.log("Resetting password for:", data.email);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Password reset successful!");
      navigate("/EmployeeeLogin");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Left - Welcome */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-700 to-blue-700 items-center justify-center p-8 relative overflow-hidden">
        <div className="text-center text-white z-10">
          <h2 className="text-5xl font-bold">Forgot Your Password?</h2>
          <p className="mt-4 text-lg opacity-90 max-w-md mx-auto">
            Reset your password securely and regain access to the Intellix
            Master Portal.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/30">
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Reset Password
            </h3>
            <p className="text-sm text-gray-600 mt-3 font-medium">
              Follow the steps to securely reset your password
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
              {/* Step 1: Email */}
              {step >= 1 && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-800">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 text-gray-900 bg-white/50 border border-gray-200 rounded-lg"
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
              )}

              {/* Step 2: OTP with Resend */}
              {step >= 2 && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-black">
                        Enter OTP{" "}
                        {otpExpired ? (
                          <span className="text-red-500 text-xs">(Expired)</span>
                        ) : (
                          <span className="text-black text-xs">({otpTimer}s left)</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2 justify-center">
                          {Array(6)
                            .fill(0)
                            .map((_, idx) => (
                              <input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={field.value?.[idx] || ""}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/, "");
                                  const currentOtp = field.value?.split("") || Array(6).fill("");
                                  currentOtp[idx] = value;
                                  field.onChange(currentOtp.join(""));
                                  if (value && e.target.nextSibling) {
                                    e.target.nextSibling.focus();
                                  }
                                }}
                                className="w-10 h-12 border text-center text-lg font-semibold text-black border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            ))}
                        </div>
                      </FormControl>

                      {otpExpired && (
                        <div className="mt-2 text-center">
                          <Button
                            type="button"
                            variant="link"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            onClick={handleEmail}
                          >
                            Resend OTP
                          </Button>
                        </div>
                      )}

                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-800">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            {...field}
                            placeholder="Enter new password"
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 text-gray-900 bg-white/50 border border-gray-200 rounded-lg"
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-gray-500 cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              )}

              {/* Step Buttons */}
              {step === 1 && (
                <Button type="button" onClick={handleEmail} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg">
                  Send OTP
                </Button>
              )}
              {step === 2 && (
                <Button type="button" onClick={handleOtp} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg">
                  Verify OTP
                </Button>
              )}
              {step === 3 && (
                <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg">
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              )}
            </form>
          </Form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Back to{" "}
            <a href="/EmployeeeLogin" className="text-indigo-600 font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
