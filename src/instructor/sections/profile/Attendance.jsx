import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import logo from "../../../assets/logo/image.png";
import { EmployeeAttendance } from "@/instructor/Redux/Api/EmployeeApi";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import No_data_found from "@/instructor/common/no_data_found";
const Attendance = () => {
  const token = useSelector((state) => state.employee?.token);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { attendanceData, loading, error } = useSelector(
    (state) => state.EmployeeProfile
  );
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.error?.length > 0
      ? error.error[0]?.message
      : error?.message || "Something went wrong. Please try again.";
  const getCurrentMonthRange = () => {
    const now = new Date(); // today
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const format = (date) =>
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    return {
      start: format(firstDay), // 1st of the month
      end: format(now), // today's date
    };
  };

  const [startDate, setStartDate] = useState(getCurrentMonthRange().start);
  const [endDate, setEndDate] = useState(getCurrentMonthRange().end);

  useEffect(() => {
    if (!token) return;

    const fetchInitialAttendance = async () => {
      await tryCatchWrapper(() =>
        dispatch(
          EmployeeAttendance({
            token,
            startDate,
            endDate,
            page,
            limit: ITEMS_PER_PAGE,
          })
        ).unwrap()
      );
    };

    fetchInitialAttendance();
  }, [dispatch, token, page]);

  const handleShowAttendance = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both Start and End dates");
      return;
    }

    await tryCatchWrapper(() =>
      dispatch(
        EmployeeAttendance({
          token,
          startDate,
          endDate,
          page,
          limit: ITEMS_PER_PAGE,
        })
      ).unwrap()
    );
  };

const ITEMS_PER_PAGE = 12;
const paginatedData = attendanceData?.data || [];
const totalPages = attendanceData?.totalPages || 1;

  return (
    <div className="w-full px-4 py-6  min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Selected Days",
            value: attendanceData?.summary?.selectedDays || 0,
            textColor: "text-blue-600",
          },
          {
            label: "Present Days",
            value: attendanceData?.summary?.present || 0,
            textColor: "text-green-600",
          },
          {
            label: "Half Days",
            value: attendanceData?.summary?.halfDay || 0,
            textColor: "text-yellow-500",
          },
          {
            label: "Absent Days",
            value: attendanceData?.summary?.absent || 0,
            textColor: "text-red-600",
          },
        ].map((item, i) => (
          <Card key={i} className="border rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left gap-1">
                <p className="text-sm font-semibold text-gray-600">
                  {item.label}
                </p>
                <p className={`text-3xl font-bold ${item.textColor}`}>
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        {/* Date Pickers */}
        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
              max={new Date().toISOString().split("T")[0]}
              placeholder="Start Date"
            />
          </div>

          <div className="relative">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
              max={new Date().toISOString().split("T")[0]}
              placeholder="End Date"
            />
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            onClick={handleShowAttendance}
          >
            Show
          </Button>
        </div>

        {/* Tabs */}
        {/* <div className="flex gap-4 font-semibold text-lg">
          <span className="text-gray-800 border-b-2 border-gray-800">Present</span>
          <span className="text-gray-500">Halfs</span>
        </div> */}
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
          </div>
        </div>
      ) :  paginatedData?.length === 0 ? (
        <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
          <No_data_found />
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-blue-100 dark:bg-gray-700">
              <TableRow>
                <TableHead className="border px-4 py-3 text-gray-800 dark:text-white">
                  S.No
                </TableHead>
                <TableHead className="border px-4 py-3 text-gray-800 dark:text-white">
                  Punch-In
                </TableHead>
                <TableHead className="border px-4 py-3 text-gray-800 dark:text-white">
                  Punch-Out
                </TableHead>
                <TableHead className="border px-4 py-3 text-gray-800 dark:text-white">
                  Attendance Date
                </TableHead>
                <TableHead className="border px-4 py-3 text-gray-800 dark:text-white">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((record, index) => (
                  <TableRow
                    key={record.id || index}
                    className="text-gray-700 dark:bg-gray-900 bg-white dark:text-white"
                  >
                    <TableCell className="border px-4 py-3">
                      {attendanceData?.summary?.startIndex + index}
                    </TableCell>
                    <TableCell className="border px-4 py-3">
                      {record.punchIn || "N/A"}
                    </TableCell>
                    <TableCell className="border px-4 py-3">
                      {record.punchOut || "N/A"}
                    </TableCell>
                    <TableCell className="border px-4 py-3">
                      {record.attendanceDate}
                    </TableCell>
                    <TableCell
                      className={`border px-4 py-3 font-semibold ${
                        record.status === "present"
                          ? "text-green-600"
                          : record.status === "Half"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-400"
                  >
                    <No_data_found />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* ShadCN Pagination */}
          <Pagination>
            <PaginationContent className="mt-6 justify-end">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.max(1, prev - 1));
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    className={`px-4 py-2 rounded-md ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Attendance;
