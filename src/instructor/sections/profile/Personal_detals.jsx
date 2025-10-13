import React from "react";

import "./Profile.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Employee } from "@/instructor/Redux/Api/EmployeeApi";
import { useSelector } from "react-redux";
import No_data_found from "@/instructor/common/no_data_found";
import logo from "../../../assets/logo/image.png";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
const Personal_detals = () => {
  const token = useSelector((state) => state.employee?.token);
  const dispatch = useDispatch();
  const { Employeee, loading, error } = useSelector(
    (state) => state.EmployeeProfile
  );
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.error?.length > 0
        ? error.error[0]?.message
        : error?.message || "Something went wrong. Please try again.";
  useEffect(() => {
    if (!token) return;
    tryCatchWrapper(() => dispatch(Employee(token)).unwrap());
  }, [dispatch, token]);

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
          </div>
        </div>
      ) :  Employeee?.length === 0 ? (
        <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
          <No_data_found />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-4 mb-5 md:px-8">
          {/* Left Card - Profile */}
          <Card className="w-full shadow-xl rounded-2xl p-5">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32">
                <Avatar className="w-full h-full shadow-lg rounded-full">
                  <AvatarImage
                    className="rounded-full border-4 border-blue-600"
                    src={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${Employeee?.image_path}`}
                    alt="Employee"
                  />
                  <AvatarFallback> {Employeee?.first_name?.at(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="mt-4 text-xl  font-semibold">
                {Employeee?.first_name}
              </CardTitle>
              <CardDescription className="">Employee</CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <ul className="space-y-3 text-sm sm:text-base">
                <li className="flex flex-col sm:flex-row justify-between items-center gap-1 border-b pb-3">
                  <span className="text-gray-500 font-medium">
                    Phone Number
                  </span>
                  <span
                    className="text-green-600 font-bold truncate max-w-[150px] whitespace-nowrap overflow-hidden"
                    title={Employeee?.contact_number}
                  >
                    {Employeee?.contact_number || "N/A"}
                  </span>
                </li>

                <li className="flex flex-col sm:flex-row justify-between items-center gap-1 border-b pb-3">
                  <span className="text-gray-500 font-medium">Email</span>
                  <span
                    className="text-green-600 font-bold truncate max-w-[150px] whitespace-nowrap overflow-hidden"
                    title={Employeee?.email}
                  >
                    {Employeee?.email || "N/A"}
                  </span>
                </li>

                <li className="flex flex-col sm:flex-row justify-between items-center gap-1 border-b pb-3">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span
                    className="text-green-600 font-bold truncate max-w-[150px] whitespace-nowrap overflow-hidden"
                    title={Employeee?.status || "N/A"}
                  >
                    {Employeee?.status || "N/A"}
                  </span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="flex justify-center pt-4">
              <button className="text-blue-600 font-semibold hover:underline">
                Portfolio
              </button>
            </CardFooter>
          </Card>

          {/* Right Card - Details */}
          <Card className="w-full shadow-xl rounded-2xl p-6">
            <CardHeader>
              <div className="text-center font-semibold text-lg">
                Employee Details
              </div>
              <hr className="mt-2 border-gray-300" />
            </CardHeader>

            <CardContent className="pt-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-500">
                {[
                  {
                    label: "Full Name",
                    value: `${Employeee?.first_name || ""} ${Employeee?.last_name || ""
                      }`,
                  },
                  {
                    label: "Department",
                    value: Employeee?.department_details || "N/A",
                  },
                  {
                    label: "Phone Number",
                    value: Employeee?.contact_number || "N/A",
                  },
                  {
                    label: "Date of Birth",
                    value: Employeee?.date_of_birth
                      ? new Date(Employeee.date_of_birth).toLocaleDateString("en-GB")
                      : "N/A",
                  },
                  {
                    label: "Emergency Contact",
                    value: Employeee?.contact_number || "N/A",
                  },
                  {
                    label: "Alternate Contact",
                    value: Employeee?.emergency_number || "N/A",
                  },
                  {
                    label: "Residential Address",
                    value: Employeee?.residential_address || "N/A",
                  },
                  {
                    label: "Bank Account Number",
                    value: Employeee?.account_number || "N/A",
                  },
                  {
                    label: "IFSC Number",
                    value: Employeee?.ifsc_code || "N/A",
                  },
                  {
                    label: "Created At",
                    value: Employeee?.joining_date
                      ? new Date(Employeee.joining_date).toLocaleDateString(
                        "en-GB"
                      )
                      : "N/A",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex flex-col gap-1 border-b pb-2">
                    <span className="font-medium">{item.label}</span>
                    <span
                      className="font-semibold truncate max-w-[200px] overflow-hidden whitespace-nowrap"
                      title={item.label === "Department" ? item.value.map((v, i) => (
                        v.name
                      )) : item.value}
                    >
                      {item.label === "Department" ? item.value.map((v, i) => (
                        v.name
                      )) : item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Personal_detals;
