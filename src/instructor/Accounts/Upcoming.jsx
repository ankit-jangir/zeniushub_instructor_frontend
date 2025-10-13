import { useLocation, useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUpcomingEmis,
  downloadEmiExcel,
  updateEmiPayment,
} from "../Redux/Api/Accounts_api"; // Add downloadEmiExcel
import AppSidebar from "../common/sidebar/Sidebar";
import Header from "../common/header/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { debounce } from "@mui/material";
import tryCatchWrapper from "../utils/TryCatchHandler";

const Upcoming = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [comps, setComps] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [localFromDate, setLocalFromDate] = useState("");
  const [localToDate, setLocalToDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const [selectedBatch, setSelectedBatch] = useState("Select Batch");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [openDialogId, setOpenDialogId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dialogError, setDialogError] = useState("");
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  const dispatch = useDispatch();
  const {
    data: emis = [],
    meta = {},
    loading,
    error,
  } = useSelector((state) => {
    console.log("Redux State:", state.emi);
    return state.emi;
  });

  const queryParams = new URLSearchParams(location.search);
  const selectedMonth =
    queryParams.get("month") || (new Date().getMonth() + 1).toString();
  const selectedYear =
    queryParams.get("year") || new Date().getFullYear().toString();

  const calculateDateRange = (month, year) => {
    const fromDate = `${year}-${month.padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const toDate = `${year}-${month.padStart(2, "0")}-${lastDay}`;
    return { fromDate, toDate };
  };

  useEffect(() => {
    if (!localFromDate && !localToDate) {
      const { fromDate, toDate } = calculateDateRange(
        selectedMonth,
        selectedYear
      );
      setLocalFromDate(fromDate);
      setLocalToDate(toDate);
    }
  }, [selectedMonth, selectedYear, localFromDate, localToDate]);

  const { paymentData } = useSelector((state) => state.emi);

  const fetchEmis = useCallback(() => {
    const limit = 9;
    const { fromDate, toDate } = calculateDateRange(
      selectedMonth,
      selectedYear
    );
    const params = {
      fromDate: localFromDate || fromDate,
      toDate: localToDate || toDate,
      status: "upcoming",
      courseId: selectedCourseId,
      batchId: selectedBatchId,
      page: currentPage,
      limit,
      search: comps,
    };
    console.log("API Payload:", params);
    dispatch(getUpcomingEmis({ ...params, token }));
  }, [
    dispatch,
    selectedCourseId,
    selectedBatchId,
    currentPage,
    localFromDate,
    localToDate,
    comps,
    selectedMonth,
    selectedYear,
  ]);

  useEffect(() => {
    fetchEmis();
  }, [fetchEmis]);

  const courses = Array.isArray(emis)
    ? Array.from(
        new Set(
          emis
            .map((item) => item?.Student_Enrollment?.Course?.course_name)
            .filter(Boolean)
        )
      ).map((name) => ({
        id:
          emis.find(
            (item) => item?.Student_Enrollment?.Course?.course_name === name
          )?.Student_Enrollment?.Course?.id || "",
        course_name: name,
      }))
    : [];
  const handleUpdatePayment = async (id) => {
    if (!selectedDate) {
      setDialogError("Please select a payment date.");
      return;
    }
    setDialogError("");
    setOpenDialogId(null);
    // alert(`Payment marked as paid for ID: ${id} on ${selectedDate}`);
    await tryCatchWrapper(() => dispatch(
      updateEmiPayment({
        token,
        emi_id: id,
        payment_date: selectedDate,
      })
    ).unwrap());
    
  };
  const batches = Array.isArray(emis)
    ? Array.from(
        new Set(
          emis
            .map((item) => item?.Student_Enrollment?.Batch?.BatchesName)
            .filter(Boolean)
        )
      ).map((name) => ({
        id:
          emis.find(
            (item) => item?.Student_Enrollment?.Batch?.BatchesName === name
          )?.Student_Enrollment?.Batch?.id || "",
        BatchesName: name,
      }))
    : [];

  const handleSelectCourse = (name, id) => {
    setSelectedCourse(name || "All");
    setSelectedCourseId(id);
    setSelectedBatch("Select Batch");
    setSelectedBatchId("");
    setCurrentPage(1);
  };

  const handleSelectBatch = (name, id) => {
    setSelectedBatch(name);
    setSelectedBatchId(id);
    setCurrentPage(1);
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setComps(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value;
    setLocalFromDate(selectedDate);
    setIsOpen(false);
    setCurrentPage(1);
  };

  const handleToDateChange = (e) => {
    const selectedDate = e.target.value;
    setLocalToDate(selectedDate);
    setIsOpen(false);
    setCurrentPage(1);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
          {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                onClick={() => window.history.back()}
                aria-label="Go back to student account"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">
                  Back to Student Account
                </span>
              </Button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Filter by Date</Button>
                </DialogTrigger>
                <DialogContent
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="sm:max-w-[425px]"
                >
                  <DialogHeader className="text-center">
                    <DialogTitle>Filter by Date</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">FROM :</Label>
                      <Button
                        variant="outline"
                        className="w-[250px] flex items-center text-left justify-between shadow-sm border border-blue-400 rounded-xl px-4 py-2 shadow-blue-500/50 font-normal"
                        onClick={(e) => {
                          e.preventDefault();
                          fromInputRef.current?.showPicker();
                        }}
                      >
                        {localFromDate || "Pick a date"}
                        <CalendarIcon className="h-5 w-5" />
                      </Button>
                      <Input
                        ref={fromInputRef}
                        type="date"
                        value={localFromDate}
                        onChange={handleFromDateChange}
                        className="opacity-0 absolute -z-10"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">TO :</Label>
                      <Button
                        variant="outline"
                        className="w-[250px] flex items-center text-left justify-between shadow-sm border border-blue-400 rounded-xl px-4 py-2 shadow-blue-500/50 font-normal"
                        onClick={(e) => {
                          e.preventDefault();
                          toInputRef.current?.showPicker();
                        }}
                      >
                        {localToDate || "Pick a date"}
                        <CalendarIcon className="h-5 w-5" />
                      </Button>
                      <Input
                        ref={toInputRef}
                        type="date"
                        value={localToDate}
                        onChange={handleToDateChange}
                        className="opacity-0 absolute -z-10"
                      />
                    </div>
                  </div>
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-600"
              onClick={() => {
                const params = {
                  fromDate:
                    localFromDate ||
                    calculateDateRange(selectedMonth, selectedYear).fromDate,
                  toDate:
                    localToDate ||
                    calculateDateRange(selectedMonth, selectedYear).toDate,
                  status: "upcoming", // Set to "upcoming" for this component
                  courseId: selectedCourseId || "",
                  batchId: selectedBatchId || "",
                };
                dispatch(downloadEmiExcel({ ...params, token }));
              }}
            >
              Export Excel
            </Button>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                  >
                    {selectedCourse}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                  <DropdownMenuGroup className="bg-white dark:bg-[#1e2939] w-33">
                    <DropdownMenuItem
                      onClick={() => handleSelectCourse("", "")}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      All
                    </DropdownMenuItem>
                    {courses.map((c) => (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => handleSelectCourse(c.course_name, c.id)}
                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        {c.course_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                    disabled={selectedCourse === "Select Course"}
                  >
                    {selectedBatch}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto bg-white dark:bg-[#1e2939] w-33">
                  {selectedCourse !== "Select Course" && batches.length > 0 ? (
                    batches.map((batch) => (
                      <DropdownMenuItem
                        key={batch.id}
                        onClick={() =>
                          handleSelectBatch(batch.BatchesName, batch.id)
                        }
                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        {batch.BatchesName}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      {selectedCourse === "Select Course"
                        ? "Select a course first"
                        : "No batches available"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div> */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
  
  {/* Left side: Back + Filter */}
  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
    <Button
      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto"
      onClick={() => window.history.back()}
    >
      <ArrowLeft size={18} />
      <span className="hidden sm:inline">Back to Student Account</span>
    </Button>

    {/* Filter dialog */}
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">Filter by Date</Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader className="text-center">
          <DialogTitle>Filter by Date</DialogTitle>
        </DialogHeader>
        {/* content */}
      </DialogContent>
    </Dialog>
  </div>

  {/* Center: Export Excel Button */}
  <div className="w-full sm:w-auto">
    <Button
      className="bg-blue-600 text-white hover:bg-blue-600 w-full sm:w-auto"
      onClick={() => {
        const params = {
          fromDate: localFromDate || calculateDateRange(selectedMonth, selectedYear).fromDate,
          toDate: localToDate || calculateDateRange(selectedMonth, selectedYear).toDate,
          status: "upcoming",
          courseId: selectedCourseId || "",
          batchId: selectedBatchId || "",
        };
        dispatch(downloadEmiExcel({ params, token }));
      }}
    >
      Export Excel
    </Button>
  </div>

  {/* Right side: Dropdowns */}
  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
    {/* Course Dropdown */}
   

    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      className="flex items-center justify-between gap-2 border-gray-300 dark:border-gray-600 sm:w-[150px]" title={selectedCourse}
    >
      <span className="truncate block">{selectedCourse}</span>
      <ChevronDown className="w-4 h-4 shrink-0" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="max-h-60 overflow-y-auto">
    <DropdownMenuGroup className="bg-white dark:bg-[#1e2939] w-33">
      <DropdownMenuItem onClick={() => handleSelectCourse("", "")}>All</DropdownMenuItem>
      {courses.map((c) => (
        <DropdownMenuItem
          key={c.id}
          onClick={() => handleSelectCourse(c.course_name, c.id)}
        >
          {c.course_name}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>


    {/* Batch Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
      className="flex items-center justify-between gap-2 border-gray-300 dark:border-gray-600 sm:w-[150px]" title={selectedBatch}
          disabled={selectedCourse === "Select Course"}
        >
         <span className="truncate block">{selectedBatch}</span>
      <ChevronDown className="w-4 h-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-60 overflow-y-auto bg-white dark:bg-[#1e2939] w-33">
        {selectedCourse !== "Select Course" && batches.length > 0 ? (
          batches.map((batch) => (
            <DropdownMenuItem
              key={batch.id}
              onClick={() => handleSelectBatch(batch.BatchesName, batch.id)}
            >
              {batch.BatchesName}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            {selectedCourse === "Select Course" ? "Select a course first" : "No batches available"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>

          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center py-6">Loading...</p>
              ) : Array.isArray(emis) && emis.length > 0 ? (
                <table className="w-full text-sm text-gray-800 dark:text-gray-200">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-left">
                    <tr>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        S.No
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Batch Name
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Course Name
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Student Name
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Due Date
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Amount
                      </th>
                      {/* <th className="p-4 font-semibold border-b border-gray-300">Due Amount</th> */}
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {emis.map((row, index) => {
                      console.log("Row data:", row);
                      return (
                        <tr
                          key={row.id}
                          className="transition hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => navigate("/student/profile", {
                            state: {
                              from: "accounts/upcoming",
                              studentId: row.Student_Enrollment?.id
                            }
                          })}
                        >
                          <td className="p-4 border-b">
                            {index + 1 + (currentPage - 1) * (meta.limit || 9)}
                          </td>
                          <td className="p-4 border-b max-w-[150px] truncate" title={row.Student_Enrollment?.Batch?.BatchesName ||
                              "N/A"}>
                            {row.Student_Enrollment?.Batch?.BatchesName ||
                              "N/A"}
                          </td>
                          <td className="p-4 border-b max-w-[150px] truncate" title={row.Student_Enrollment?.Course?.course_name ||
                              "N/A"}>
                            {row.Student_Enrollment?.Course?.course_name ||
                              "N/A"}
                          </td>
                          <td className="p-4 border-b">
                            {row.Student_Enrollment?.Student?.name || "N/A"}
                          </td>
                          <td className="p-4 border-b">
                            {row.emi_duedate ? (
                              new Date(row.emi_duedate).toLocaleDateString()
                            ) : (
                              <span className="italic text-orange-500">
                                Not Paid
                              </span>
                            )}
                          </td>
                          <td className="p-4 border-b font-semibold text-orange-600 dark:text-orange-400">
                            {typeof row.amount === "number"
                              ? `₹${row.amount.toLocaleString()}`
                              : "N/A"}
                          </td>

                          <td
                            className="p-4 border-b"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Dialog
                              open={openDialogId === row.id}
                              onOpenChange={(isOpen) => {
                                setDialogError("");
                                setOpenDialogId(isOpen ? row.id : null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-green-600 underline hover:text-green-800"
                                  onClick={() => {
                                    setOpenDialogId(row.id);
                                    setSelectedDate("");
                                  }}
                                >
                                  Mark as Paid
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Mark as Paid</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="payment-date"
                                      className="text-right"
                                    >
                                      Date
                                    </Label>
                                    <Input
                                      id="payment-date"
                                      type="date"
                                      value={selectedDate}
                                      onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                {dialogError && (
                                  <p className="text-red-500 text-sm">
                                    {dialogError}
                                  </p>
                                )}
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    onClick={() => handleUpdatePayment(row.id)}
                                  >
                                    Save Status
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-6 text-gray-500">No data found</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {meta?.totalPages &&
                  Array.from({ length: meta.totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        className={
                          currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                        }
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
                      if (currentPage < meta?.totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === meta?.totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    aria-disabled={currentPage === meta?.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Upcoming;
