import React, { useMemo, useState } from "react";
import {
  Calendar,
  CalendarIcon,
  Clock,
  ClockIcon,
  FileText,
  Eye,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchQuizHistory,
  get_quiz_by_id,
  getDeclaredResult,
} from "@/instructor/Redux/Api/Quiz_api";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { useSelector } from "react-redux";
import No_data_found from "@/instructor/common/no_data_found";

const batches = [
  {
    id: "b1",
    name: "Marksheet",
    students: [
      { id: 1, name: "Mohan" },
      { id: 2, name: "Drati Mittal" },
      { id: 5, name: "Anshraj Pal" },
      { id: 6, name: "Shivji" },
      { id: 7, name: "Ritika Sharma" },
      { id: 8, name: "Rohan Mehta" },
      { id: 9, name: "Nisha Bansal" },
      { id: 10, name: "Tarun Joshi" },
      { id: 11, name: "Pooja Singh" },
      { id: 12, name: "Ravi Kumar" },
      { id: 13, name: "Kavita Rao" },
      { id: 14, name: "Aditya Roy" },
      { id: 15, name: "Swati Mishra" },
    ],
  },
  {
    id: "b2",
    name: "Saksham",
    students: [
      { id: 3, name: "Harshita Thory" },
      { id: 4, name: "Krishna Prajapati" },
      { id: 16, name: "Nitin Jangir" },
      { id: 17, name: "Meena Kumari" },
      { id: 18, name: "Deepak Yadav" },
      { id: 19, name: "Sneha Gupta" },
      { id: 20, name: "Yashvi Jain" },
      { id: 21, name: "Karan Patel" },
      { id: 22, name: "Muskan Verma" },
    ],
  },
];

const students = [
  { id: 1, name: "Mohan", status: "pass", marks: 34 },
  { id: 2, name: "Drati Mittal", status: "pass", marks: 30 },
  { id: 3, name: "Harshita Thory", status: "pass", marks: 43 },
  { id: 4, name: "Krishna Prajapati", status: "pass", marks: 50 },
  { id: 5, name: "Anshraj Pal", status: "fail", marks: 5 },
  { id: 6, name: "Shivji", status: "fail", marks: 5 },
  { id: 7, name: "Ritika Sharma", status: "fail", marks: 8 },
  { id: 8, name: "Rohan Mehta", status: "pass", marks: 48 },
  { id: 9, name: "Nisha Bansal", status: "fail", marks: 18 },
  { id: 10, name: "Tarun Joshi", status: "pass", marks: 39 },
  { id: 11, name: "Pooja Singh", status: "pass", marks: 42 },
  { id: 12, name: "Ravi Kumar", status: "fail", marks: 12 },
  { id: 13, name: "Kavita Rao", status: "pass", marks: 36 },
  { id: 14, name: "Aditya Roy", status: "fail", marks: 17 },
  { id: 15, name: "Swati Mishra", status: "pass", marks: 45 },
  { id: 16, name: "Nitin Jangir", status: "fail", marks: 21 },
  { id: 17, name: "Meena Kumari", status: "pass", marks: 44 },
  { id: 18, name: "Deepak Yadav", status: "fail", marks: 6 },
  { id: 19, name: "Sneha Gupta", status: "pass", marks: 49 },
  { id: 20, name: "Yashvi Jain", status: "fail", marks: 10 },
  { id: 21, name: "Karan Patel", status: "pass", marks: 33 },
  { id: 22, name: "Muskan Verma", status: "fail", marks: 9 },
];

const History = () => {
  const [loadingResult, setLoadingResult] = useState(false);


  let token = localStorage.getItem("token");

  token = useSelector((state) => state.employee.token);
  const [batch, setBatch] = useState(null);
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const { data, loading, error } = useSelector((s) => s.quizzSlice);
  const { quiz } = useSelector((s) => s?.quizzSlice);

  const [opensheet, setopensheet] = useState(false);

  console.log(data?.data, "dataaaahistory");

  const { declaredResult } = useSelector((state) => state.quizzSlice);

  const [open, setopen] = useState(false);
  const [selectedSubjects, setSelectedSubject] = useState(null);
  const dispatch = useDispatch();



  const handleOpen = async (b) => {
    setBatch(b);
    setLoadingResult(true);
    setopen(true);
    await tryCatchWrapper(() =>
      dispatch(
        getDeclaredResult({
          sessionId: b.id,
          token,
        })
      ).unwrap()
    ).finally(() => setLoadingResult(false));



  };
  // const studentData = useMemo(() => {
  //   return batch?.students.map((bStudent) => ({
  //     ...bStudent,
  //     details: students.find(
  //       (s) => s.name.toLowerCase() === bStudent.name.toLowerCase()
  //     ),
  //   }));
  // }, [batch]);
  const [page, setPage] = useState(1);

  const Examperpage = 12;
  const historydata = data?.data;
  const totalPages = Math.ceil(data?.pagination?.totalRecords / Examperpage);
  const paginatedData = historydata;
  const fetchquizhistory = async () => {
    if (sessionID) {
      await tryCatchWrapper(() =>
        dispatch(
          fetchQuizHistory({
            session_id: sessionID,
            token,
            page: page,
            limit: Examperpage,
          })
        ).unwrap()
      );
    }
  };

  useEffect(() => {
    fetchquizhistory();
  }, [dispatch, sessionID, page]);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {paginatedData?.length > 0 ? (
          paginatedData?.map((exam, index) => (
            <Card
              key={index}
              className="w-full bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-md dark:shadow-blue-500/50 mb-4"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {exam.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p><strong>Course</strong>: {exam.course_name}</p>



                  <div className="max-h-24 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-800">
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subjects:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm">
                      {exam?.subject_names?.map((subject, idx) => (  // Changed to exam.subject_names
                        <li key={idx}>{subject}</li>
                      ))}
                    </ul>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-blue-500" />
                  {exam.quizz_date ?? "Not Scheduled"}
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon size={16} className="text-blue-500" />
                  {exam.quizz_time ?? "Not Scheduled"}
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon size={16} className="text-blue-500" />
                  Questions: {exam.total_question}
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <div className="w-full">
                  <Progress
                    value={exam.passing_percentage}
                    className="h-2 w-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                    Passing Percentage: {exam.passing_percentage}%
                  </span>
                </div>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full px-12 text-white"
                  onClick={() => {
                    setopensheet(true);
                    dispatch(get_quiz_by_id({ id: exam.id, token }));
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center w-full py-12 text-gray-500 dark:text-gray-400 text-lg">
            <No_data_found />
          </div>
        )}
      </div>

      {/* Sheet for Quiz Details */}
      <Sheet open={opensheet} onOpenChange={setopensheet}>
        <SheetTrigger></SheetTrigger>
        <SheetContent className="bg-white dark:bg-gray-900 border-l w-full max-w-md p-6 overflow-y-auto scrollbar-thin">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-4 flex items-center space-x-3">
              <FileText className="w-7 h-7 text-blue-600" />
              <span>Quiz Details</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-6 text-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="text-xl font-semibold text-blue-600">
                Quiz Name: {quiz?.data?.title || "N/A"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm space-y-2">

              <div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <strong className="font-semibold text-gray-900 dark:text-gray-100 inline-block">
                      Course:
                    </strong>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 truncate inline-block" style={{ maxWidth: '210px' }} title={quiz?.data?.Course?.course_name || "N/A"}>
                      {quiz?.data?.Course?.course_name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <p>
                <strong>Total Marks:</strong>{" "}
                {quiz?.data?.total_marks === 0 ? 0 : quiz?.data?.total_marks || "N/A"}
              </p>
              <p>
                <strong>Passing Percentage:</strong>{" "}
                {quiz?.data?.passing_percentage === 0 ? 0 : quiz?.data?.passing_percentage || "N/A"}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="text-sm font-medium mb-2">
                <strong>Subject:</strong>
              </p>

              <div className="max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1">
                {Array.isArray(quiz?.data?.subject_names) &&
                  quiz.data.subject_names.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {quiz.data.subject_names.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">N/A</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p>
                <strong>Number of Questions:</strong>{" "}
                {quiz?.data?.total_question || "N/A"}
              </p>
            </div>
            {/* Time Per Question
                     <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                       <p className="font-semibold">Time Per Question:</p>
                       <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                         <Clock className="w-5 h-5 text-blue-600" />
                         <span>{quiz?.data?.time_period || "N/A"} seconds</span>
                       </div>
                     </div> */}
            {/* Quiz Rules */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                Quiz Rules
              </p>
              <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pr-2">
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  {quiz?.data?.quizz_rules?.map((rule, index) => (
                    <li key={index} className="leading-relaxed">
                      {rule || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="font-semibold">Exam Schedule:</p>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>{quiz?.data?.quizz_date || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{quiz?.data?.quizz_time || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="text-lg font-medium mb-3">
                Subject-wise Composition
              </p>

              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-2">
                {quiz?.data?.subject_compostition &&
                  Object.entries(quiz.data.subject_compostition).map(
                    ([subject, percentage]) => (
                      <div
                        key={subject}
                        className="mb-4 cursor-pointer"
                        onClick={() => toggleSubject(subject)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {subject}
                          </p>
                          <span className="text-sm font-semibold text-blue-600">
                            {percentage}%
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
                        />
                      </div>
                    )
                  )}
              </div>

              {selectedSubjects?.length > 0 && (
                <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                  Selected Subjects: {selectedSubjects.join(", ")}
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="font-semibold pb-5">Passing Percentage:</p>

              <Progress
                value={quiz?.data?.passing_percentage}
                className="h-2 w-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                Passing Percentage: {quiz?.data?.passing_percentage}%
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p className="font-semibold mb-2">Batches:</p>

              {quiz?.data?.batch_Quizzs?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 cursor-pointer text-blue-500 underline hover:text-blue-400">
                  {quiz.data.batch_Quizzs.map((b) => (
                    <li key={b.id} onClick={() => handleOpen(b)}>
                      {b.Batch?.BatchesName || "Unnamed Batch"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
            {/* Batch Dialog */}

            <Dialog open={open} onOpenChange={setopen}>
              <DialogOverlay className="fixed inset-0 bg-black/20" />
              <DialogContent className="w-full sm:max-w-[850px] max-h-[80vh] overflow-y-auto p-6 rounded-2xl bg-white dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Declared Result -{" "}
                    <span className="text-blue-600">{batch?.Batch.BatchesName}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6 rounded-xl border bg-white dark:bg-gray-900 shadow max-h-[50vh] overflow-y-auto">
                  {loadingResult ? (
                    <div className="p-4 text-center">Loading...</div>
                  ) : declaredResult?.data?.length > 0 ? (
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium sticky top-0">
                        <tr>
                          <th className="px-6 py-4 border-b">Student ID</th>
                          <th className="px-6 py-4 border-b">Name</th>
                          <th className="px-6 py-4 border-b">Status</th>
                          <th className="px-6 py-4 border-b">Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {declaredResult?.data?.map((student) => (
                          <tr key={student.id} className="border-b">
                            <td className="px-6 py-4">
                              {student.Student_Enrollment.Student.id}
                            </td>
                            <td className="px-6 py-4 truncate w-[300px] block" title={student.Student_Enrollment.Student.name}>
                              {student.Student_Enrollment.Student.name}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={student.status === "unattempted" ? "bg-red-400 text-white" : "bg-green-400 text-white"} variant="outline">
                                {student.status ?? "N/A"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              {student.marks_obtained ?? "--"} / {quiz?.data?.total_marks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      {error || "No data found!!!"} {/* Show API error or default message */}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>


          </div>
        </SheetContent>
      </Sheet>

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
