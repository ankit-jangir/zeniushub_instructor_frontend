import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  HourglassIcon,
} from "lucide-react";
import DeclaredMarks from "./DeclaredMarks";
import ResultDeclare from "./ResultDeclare";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchExamHistory } from "@/instructor/Redux/Api/Exam_api";
import { Input } from "@/components/ui/input";
import No_data_found from "@/instructor/common/no_data_found";
import { useMemo } from "react";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";



const History = () => {
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.employee.token);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setsearch] = useState("");
  const [status, setstatus] = useState("");

  const { history, loading, error } = useSelector((s) => s.exam);
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const limit = 6;
  const Data = history?.data || [];
  const totalPages = history?.totalPages || 1; // 👈 use API's totalPages
  const paginatedData = Data;

  const fetchexamshistorydata = async () => {
    if (sessionID) {
      await tryCatchWrapper(() =>
        dispatch(
          fetchExamHistory({
            session_id: sessionID,
            token,
            page: page,
            limit,
            category_name: search,
            status: status,
          })
        ).unwrap())
    }
  }
  useEffect(() => {
    fetchexamshistorydata()
  }, [dispatch, sessionID, page, search, status]);

  return (
    <div>
      <div className="flex items-center gap-3 xl:justify-end">
        <Input
          value={search}
          onChange={(e) => {
            setsearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search exams history"
          className="w-full xl:w-72 bg-white/90 dark:bg-gray-800/90
                       border border-gray-200 dark:border-gray-700
                       text-gray-900 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500
                       transition-all duration-200"
        />
      </div>
      <h2 className="mt-6 mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        Exams History
      </h2>
      <div className="flex justify-end mb-4">
        <Select value={status} onValueChange={setstatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="declared">Declared</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData && paginatedData.length > 0 ? (
          paginatedData.map((exam) => (
            <Card
              key={exam.id}
              className="w-full cursor-pointer bg-white/95 dark:bg-gray-800/95 border shadow-lg dark:shadow-md dark:shadow-blue-500/50"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate w-[240px]" title={exam.exam_name}>
                    {exam.exam_name}
                  </CardTitle>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${exam.is_result_dec
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {exam.is_result_dec ? (
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon size={14} /> {exam.status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <HourglassIcon size={14} /> {exam.status}
                      </span>
                    )}
                  </span>
                </div>
                <CardDescription className="text-sm mt-4 text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="truncate w-[300px]" title={exam.subject_name}><strong>Subject</strong>: {exam.subject_name}</p>
                  <p className="truncate w-[300px]" title={exam.course_name}>
                    <strong>Course</strong>: {exam.course_name}
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-blue-500" />
                  Date: {exam.schedule_date}
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon size={16} className="text-blue-500" />
                  Time: {exam.start_time}
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <div className="w-full">
                  <Progress
                    value={exam.pass_percent}
                    className={`h-2 w-full bg-gray-200 dark:bg-gray-700 ${exam.is_result_dec
                      ? "[&>div]:bg-green-500"
                      : "[&>div]:bg-yellow-500"
                      }`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                    Passing Percentage: {exam.pass_percent}%
                  </span>
                </div>
                <div className="w-full">
                  {exam.is_result_dec ? (
                    <DeclaredMarks exam={exam} />
                  ) : (
                    <ResultDeclare exam={exam} fetchexamshistorydata={fetchexamshistorydata} />
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10 col-span-full">
            <No_data_found />
          </div>
        )}
      </div>

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
    </div>
  );
};

export default History;
