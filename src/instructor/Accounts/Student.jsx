import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XCircle, Clock, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmiBreakdownByDate, fetchEmiSummary } from "../Redux/Api/Accounts_api";
import { toast } from "react-toastify";
import tryCatchWrapper from "../utils/TryCatchHandler";

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const years = ["2024", "2025", "2026", "2027"];

const Students = () => {
  const navigate = useNavigate();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  const savedMonth = localStorage.getItem("selectedMonth");
  const savedYear = localStorage.getItem("selectedYear");

  const [month, setMonth] = useState(savedMonth || `${currentMonth}`);
  const [year, setYear] = useState(savedYear || `${currentYear}`);

  const dispatch = useDispatch();
  const { data, breakdown, loading, error } = useSelector((state) => state.emi);

  useEffect(() => {
    if (month && year) {
      localStorage.setItem("selectedMonth", month);
      localStorage.setItem("selectedYear", year);
    }
  }, [month, year]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("selectedMonth");
      localStorage.removeItem("selectedYear");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const emibreak = async () => {
    if (month && year) {
      await tryCatchWrapper(() =>
        dispatch(EmiBreakdownByDate({ month, year, token })).unwrap()
      );
    }
  };

  useEffect(() => {
    emibreak();
  }, [month, year, dispatch]);

  const fetchemi = async () => {
    await tryCatchWrapper(() => dispatch(fetchEmiSummary(token)).unwrap());
  };

  useEffect(() => {
    fetchemi();
  }, [dispatch]);

  const cardData = [
    {
      title: "Collected Fees",
      value: breakdown?.totalCollectedFees || 0,
      icon: <CheckCircle className="text-green-500 w-8 h-6" />,
      color: "text-green-600",
      link: "/paid",
    },
    {
      title: "Missed Fees",
      value: breakdown?.totalMissedFees || 0,
      icon: <XCircle className="text-red-500 w-8 h-6" />,
      color: "text-red-600",
      link: "/missed",
    },
    {
      title: "Upcoming Fees",
      value: breakdown?.totalUpcomingFees || 0,
      icon: <Clock className="text-blue-500 w-8 h-6" />,
      color: "text-blue-600",
      link: "/upcoming",
    },
  ];

  const cardData1 = [
    {
      label: "Total Received",
      amount: data?.total_received || 0,
      color: "text-green-600",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Today's Upcoming Amount",
      amount: data?.total_expected || 0,
      color: "text-yellow-600",
      icon: <Clock className="w-6 h-6  text-yellow-600" />,
    },
    {
      label: "Today's Missed Fees",
      amount: data?.amount_to_collect || 0,
      color: "text-red-600",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
  ];
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {cardData1.map((card, index) => (
            <Card
              key={index}
              className="bg-white border rounded-2xl shadow-md dark:shadow-blue-500/30 w-full "
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold ">{card.label}</h2>
                  {card.icon}
                </div>
                <div
                  className={`${card.color} text-2xl font-bold text-center`}
                >
                  ₹ {card.amount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {cardData1.map((card, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {card.label}
                  </h2>
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 shadow-md">
                    {card.icon}
                  </div>
                </div>

                {/* Amount */}
                <div
                  className={`${card.color} text-3xl font-extrabold text-center tracking-wide`}
                >
                  ₹ {card.amount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-10">
          {cardData.map((card, index) => (
            <Card
              key={index}
              className="bg-white border rounded-2xl shadow-md dark:shadow-blue-500/30 w-full"
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold ">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="flex items-center justify-center ">
                <span className={`text-3xl font-bold ${card.color}`}>
                  ₹ {card.value.toLocaleString()}
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-center p-4 space-y-2">
                <CardDescription className="text-gray-600 font-medium">
                  Updated Amount
                </CardDescription>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                  onClick={() =>
                    navigate(`${card.link}?month=${month}&year=${year}`)
                  }
                >
                  More Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;
