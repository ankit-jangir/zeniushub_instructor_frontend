import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeSalary } from "@/instructor/Redux/Api/Salary";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";

const Salary = () => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const dispatch = useDispatch();
  const { Employeee } = useSelector((state) => state.EmployeeProfile);
  const { data, loading } = useSelector((state) => state.salary);




  const fetchSalaries = async () => {
    if (Employeee?.id) {
      await tryCatchWrapper(() =>
        dispatch(fetchEmployeeSalary(Employeee.id)).unwrap())
    }
  };

  useEffect(() => {

    fetchSalaries();
  }, [Employeee?.id]);




  // Month wise salary
  const salaryData = data?.data?.monthWiseSalary || [];

  // Pagination
  const totalPages = Math.ceil(salaryData.length / ITEMS_PER_PAGE);
  const paginatedData = salaryData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Total Salary
  const totalSalary = salaryData.reduce(
    (sum, item) => sum + (item.totalSalary || 0),
    0
  );

  return (
    <div className="w-full px-4">
      <div className="rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800 shadow-md h-[600px] flex flex-col">
        <div className="overflow-x-auto h-full flex flex-col">
          <Table className="min-w-full table-auto flex flex-col h-full">
            <TableCaption className="text-sm text-gray-500 dark:text-gray-400">
              A list of salary for <strong>{data?.data?.employee?.first_name}</strong> ({data?.data?.employee?.salary} per month)
            </TableCaption>

            {/* Header */}
            <TableHeader className="bg-gray-100 dark:bg-gray-800 block">
              <TableRow className="table w-full table-fixed">
                <TableHead>S.No</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Attendance (In Days)</TableHead>
                <TableHead className="text-right">Per Day Salary</TableHead>
                <TableHead className="text-right">Total Salary</TableHead>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="block overflow-y-auto flex-grow">
              {loading && (
                <TableRow className="table w-full table-fixed">
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {!loading && paginatedData.length === 0 && (
                <TableRow className="table w-full table-fixed">
                  <TableCell colSpan={6} className="text-center py-4">
                    No salary data found
                  </TableCell>
                </TableRow>
              )}

              {paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={`table w-full table-fixed ${index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                    }`}
                >
                  <TableCell className="font-medium text-gray-700 dark:text-gray-200">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-200">
                    {item.month}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-200">
                    {item.totalDays}
                  </TableCell>
                  <TableCell className="flex gap-3 text-sm">
                    <span className="text-green-600">
                      {item.presentDays} Present
                    </span>
                    <span className="text-yellow-600">
                      {item.halfDays} Half
                    </span>
                    <span className="text-red-600">
                      {item.absentDays} Absent
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-gray-700 dark:text-gray-200">
                    &#8377;
                    {item.perDaySalary.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                    &#8377;
                    {item.totalSalary.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Footer */}
            <TableFooter className="bg-gray-100 dark:bg-gray-800 block">
              <TableRow className="table w-full table-fixed">
                <TableCell colSpan={5} className="font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  &#8377;
                  {totalSalary.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent className="mt-6 justify-end">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage(Math.max(1, page - 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-md ${page === i + 1
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
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Salary;
