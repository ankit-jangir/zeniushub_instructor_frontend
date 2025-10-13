import React from "react";
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
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  Code: z
    .string()
    .min(1, "School code is required")
    .refine((val) => val === "19", {
      message: "School code is wrong",
    }),
});

const CodeLogin = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Code: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    navigate("/EmployeeeLogin");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter your school code to access Intellix
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <FormField
                control={form.control}
                name="Code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      School Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your school code"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium text-sm "
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-blue-600 items-center justify-center p-8">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold tracking-tight">
            Intellix Master Portal
          </h2>
          <p className="mt-4 text-lg opacity-90 max-w-md mx-auto">
            Empowering education with seamless access to your school's
            management system.
          </p>
          <div className="mt-8">
            <svg
              className="w-32 h-32 mx-auto opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLogin;
