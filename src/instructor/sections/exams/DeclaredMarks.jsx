import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchExamsByBatchId } from "@/instructor/Redux/Api/Exam_api";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { Clock } from "lucide-react";
import { Eye } from "lucide-react";
import { Calendar } from "lucide-react";
import { CheckCheck } from "lucide-react";
import { FileText } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const DeclaredMarks = ({ exam }) => {
  const exams = exam;
  const [batch, setBatch] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);

  const dispatch = useDispatch();
  const { Exams, loadingE } = useSelector((state) => state.exam);

  const fetchExamsByBatchIds = async (b) => {
    if (b.exam_batch_id) {
      await tryCatchWrapper(() =>

        dispatch(fetchExamsByBatchId({ batchId: b.exam_batch_id, token })).unwrap())
    }
  };

  const handleOpen = (b) => {
    setBatch(b);
    setOpen(true);
    fetchExamsByBatchIds(b)
  };


  const studentData = useMemo(() => {
    return Exams?.data || [];
  }, [Exams?.data]);

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full px-12 text-white">
            View detail
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white dark:bg-gray-900 border-l border-gray-200/50 dark:border-gray-700/50 w-full max-w-md p-6 sm:p-8 overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/50 pb-4 flex items-center space-x-3">
              <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <span>Exam Report</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-6 text-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-300 mb-10">
              <p className="text-md font-semibold text-blue-600 dark:text-blue-400 flex items-center">
                Result declared on: {exams?.result_dec_date || "N/A"}{" "}
                <CheckCheck className="ms-3" />
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                Exam Name: {exams?.exam_name || "Exam Title"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">

              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Course:</span>
                <span className="text-gray-900 dark:text-gray-100 truncate w-[170px] block" title={exams?.course_name || "N/A"}>
                  {exams?.course_name || "N/A"}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Subject:
                </span>
                <span className="text-gray-900 dark:text-gray-100  truncate w-[170px] block" title={exams?.subject_name || "N/A"}>
                  {exams?.subject_name || "N/A"}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Total Marks:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {exams?.total_marks || 0}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Passing Percentage:
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {exams?.pass_percent || 0}%
                </span>
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Question Paper:
              </p>
              <a

                href={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${exams?.ques_paper}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 mt-2"
              >
                <span title={exams?.ques_paper} className="truncate w-[260px] block"> <FileText className="w-4 h-4 " />
                  {exams?.ques_paper || "View PDF"}</span>
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Exam Schedule:
              </p>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {exams?.schedule_date || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {exams?.start_time || "N/A"}{" "} to {" "}
                    {exams?.end_time || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Batches name:
              </p>

              <p

                onClick={() => handleOpen(exams)}
                className="cursor-pointer hover:underline text-blue-600"
              >
                {exams?.batch_name}
              </p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogOverlay className="fixed inset-0 z-40 bg-black/20 transition-all duration-300" />
              <DialogContent
                className="w-full lg:max-w-[900px] md:max-w-4xl sm:max-w-[95vw] max-h-[85vh] overflow-y-auto p-6 rounded-2xl z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-rendering-optimizeLegibility"
                style={{ backdropFilter: "none" }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Declared Result -{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {exams?.batch_name}
                    </span>
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow max-h-[50vh] overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 border-b">Student ID</th>
                        <th className="px-6 py-4 border-b">Name</th>
                        <th className="px-6 py-4 border-b">Result Status</th>
                        <th className="px-6 py-4 border-b">Marks</th>
                        <th className="px-6 py-4 border-b text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData?.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-6 py-4">{student.Student_Enrollment.student_id}</td>
                          <td className="px-6 py-4 truncate w-[250px] block" title={student.Student_Enrollment.Student.name}>{student.Student_Enrollment.Student.name}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${student?.status === "pass"
                                ? "text-green-700 border-green-500 bg-green-50 dark:bg-green-900/30 dark:text-green-300"
                                : "text-red-600 border-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                            >
                              {student?.status?.toUpperCase() ?? "N/A"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {student?.marks_obtained ?? "-"} / {exams.total_marks}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-blue-600 dark:text-blue-400"
                              onClick={() => navigate("/Studentprofile", {
                                state: {
                                  from: "exams",
                                  student,
                                  exams
                                }
                              })}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DeclaredMarks;
