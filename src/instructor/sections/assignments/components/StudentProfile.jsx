import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import QuizResultDetails from "./QuizResult";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import AssignmentDetails from "./Assignmentdetails";
import ExamResultDetails from "./Examresult";
import { useDispatch } from "react-redux";
import { fetchStudentResultAssignmentDetails } from "@/instructor/Redux/Api/Assignments_api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { fetchStudentExamDetails } from "@/instructor/Redux/Api/Exam_api";
import { fetchStudentQuizDetails } from "@/instructor/Redux/Api/Quiz_api";
import "@/App.css"

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [openSheet, setOpenSheet] = useState(false);
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);

  const location = useLocation();
  const [currentPageExam, setCurrentPageExam] = useState(1);
  const [currentPageQuiz, setCurrentPageQuiz] = useState(1);

  const [currentPageAss, setCurrentPageAss] = useState(1);
  const studentId = location.state?.studentId;
  const fromPage = location.state?.from || "assignments";


  const handleBack = () => {
    if (fromPage === "assignments") {
      navigate("/assignments");
    } else if (fromPage === "batches") {
      navigate("/batches");
    } else if (fromPage === "exams") {
      navigate("/exam");
    } else {
      navigate(-1);
    }
  };

  const dispatch = useDispatch();


  const { examDetails, loadingS, totalP, curntP, counts, stuDetails, totalR } = useSelector((state) => state.exam);

  const { quizDetails, loadingSQ, countsQ, pagination, studentQ } = useSelector((state) => state.quizzSlice);



  const { student_data, stu_Profile_loading, currentPageStu, countStu, totalPagesStu, totalRecordsStu } = useSelector((state) => state.assignments);


  const fetchStudentResultAssignmentDetailss = async () => {
    if (studentId) {
      await tryCatchWrapper(() =>
        dispatch(fetchStudentResultAssignmentDetails({ Student_Enrollment_id: studentId, page: currentPageAss, pageSize: 6, token })).unwrap());
    }
  };

  const fetchStudentExamDetailss = async () => {
    if (studentId) {
      await tryCatchWrapper(() =>
        dispatch(fetchStudentExamDetails({ Student_Enrollment_id: studentId, page: currentPageExam, pageSize: 6, token })).unwrap());
    }
  };


  const fetchStudentQuizDetailss = async () => {
    if (studentId) {
      await tryCatchWrapper(() =>
        dispatch(fetchStudentQuizDetails({ Student_Enrollment_id: studentId, page: currentPageQuiz, pageSize: 6, token })).unwrap());
    }
  };



  useEffect(() => {
    fetchStudentResultAssignmentDetailss();
    fetchStudentExamDetailss()
    fetchStudentQuizDetailss()
  }, [studentId, currentPageAss, currentPageExam, currentPageQuiz]);

  const resultAssignments = student_data?.results || [];




  function getResultStatus(data) {
    const totalMarks = data.BatchAssignment.Assignment.total_marks;
    const minPercentage = data.BatchAssignment.Assignment.min_percentage;
    const obtainedMarks = data.obtained_marks;
    const dueDate = new Date(data.BatchAssignment.Assignment.due_date);
    const currentDate = new Date();

    // Case 1: Obtained marks null
    if (obtainedMarks === null) {
      if (currentDate > dueDate) {
        return {
          status: "Fail",
          reason: "Assignment not attempted and due date passed",
          percentage: null
        };
      } else {
        return {
          status: "Pending",
          reason: "Assignment not attempted but due date not passed yet",
          percentage: null
        };
      }
    }

    // Case 2: Marks available → calculate percentage
    const percentage = (obtainedMarks / totalMarks) * 100;

    if (percentage >= minPercentage) {
      return {
        status: "Pass",
        reason: `Scored ${percentage.toFixed(2)}% which is >= minimum required ${minPercentage}%`,
        percentage: percentage.toFixed(2)
      };
    } else {
      return {
        status: "Fail",
        reason: `Scored ${percentage.toFixed(2)}% which is less than required ${minPercentage}%`,
        percentage: percentage.toFixed(2)
      };
    }
  }


  const passCount = resultAssignments.filter(
    (item) => getResultStatus(item).status === "Pass"
  ).length;

  const failCount = resultAssignments.filter(
    (item) => getResultStatus(item).status === "Fail"
  ).length;

  const pendingCount = resultAssignments.filter(
    (item) => getResultStatus(item).status === "Pending"
  ).length;


  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      <button
        onClick={handleBack}
        className="text-sm cursor-pointer text-blue-600 dark:text-blue-400 underline mb-4"
      >
        ← Back to {fromPage}
      </button>
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0 mb-6 p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img
            src={`${BASE_URL}/viewimagefromazure?filePath=${student_data.student?.Student.profile_image}`}
            alt={student_data.student?.Student.name?.at(0)}
            className="w-20 h-20 rounded-full border object-cover border-gray-400 dark:border-gray-700"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 break-all">{student_data.student?.Student.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Student ID: {student_data.student?.Student.id}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gender:  {student_data.student?.Student.gender}</p>
          </div>
        </div>

      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6 bg-white dark:bg-gray-800 p-2 rounded-xl shadow">
          {["general", "quiz", "exams", "assignments"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 transition-all rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="quiz" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize me-4 md:me-0">
              Total Quizs: {countsQ.total}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Attempted: {countsQ.attempted} | Unattempted: {countsQ.unattempted} |{" "}
              <span className="text-green-600 dark:text-green-400">Passed: 25</span> |{" "}
              <span className="text-red-500 dark:text-red-400">Failed: 25</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizDetails?.map((quiz, index) => (
              <Card
                key={index}
                className={`shadow-md rounded-2xl border ${quiz?.quizz?.status === "Passed"
                  ? "border-green-200 dark:border-green-700"
                  : quiz?.quizz?.status === "Failed"
                    ? "border-red-200 dark:border-red-700"
                    : "border-gray-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800 hover:shadow-lg transition`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {quiz?.batch_Quizz.quizz?.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-1 rounded-full ${quiz?.status === "unattempted"
                        ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                        }`}
                    >
                      {quiz?.status}
                    </Badge>
                  </div>



                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4" />

                    {quiz?.batch_Quizz.quizz?.quizz_timing}
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      Passing Percentage:{" "}
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {quiz?.batch_Quizz.quizz?.passing_percentage}%
                      </span>
                    </p>
                    <p>
                      Student Percentage:{" "}
                      <span
                        className={
                          quiz?.marks_percentage >= quiz?.quizz?.passing_percentage
                            ? "text-green-600 dark:text-green-400"
                            : quiz?.marks_percentage === null
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-red-600 dark:text-red-400"
                        }
                      >
                        {quiz?.marks_percentage || "--"}%
                      </span>
                    </p>
                  </div>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedQuiz(quiz)} variant="blueHover" className="mt-4 w-full"> View Details</Button>
                    </DialogTrigger>
                    <DialogContent


                      onInteractOutside={(e) => e.preventDefault()}
                      className="rounded-2xl shadow-2xl scrollbar-hide overflow-y-auto w-full bg-white dark:bg-[#1f2937] p-0 border"
                      style={{

                        maxWidth: "58rem",
                        width: "100%",
                        height: "auto", maxHeight: "80vh"
                      }}
                    >
                      <QuizResultDetails setOpen={setOpen} quiz={selectedQuiz} name={studentQ.Student.name} id={studentQ.Student.id} img={studentQ?.Student.profile_image} />

                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>


          <div className="flex justify-center items-center gap-3 mt-5">
            <Button
              disabled={currentPageQuiz === 1}
              onClick={() => setCurrentPageQuiz((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span>
              Page {currentPageQuiz} of {pagination.totalPages}
            </span>
            <Button
              disabled={currentPageQuiz === pagination.totalPages}
              onClick={() => setCurrentPageQuiz((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>

        </TabsContent>


        {/* General Tab */}
        <TabsContent value="general">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { label: "Email", value: student_data.student?.Student.email },
              { label: "Father's Name", value: student_data.student?.Student.father_name },
              { label: "Mother's Name", value: student_data.student?.Student.mother_name },
              { label: "Previous School", value: student_data.student?.Student.ex_school },
              { label: "Contact No.", value: student_data.student?.Student.contact_no },
              { label: "Enrollment ID", value: student_data.student?.Student.enrollment_id },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className={`mt-1 text-base font-semibold text-gray-800 dark:text-gray-100 break-all `}>
                  {item.value || "--"}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>


        <TabsContent value="assignments" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize me-4 md:me-0">
              Total assignments: {totalRecordsStu}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Attempted: {countStu.attempted} | Unattempted: {countStu.unattempted} |{" "}
              <span className="text-green-600 dark:text-green-400">Passed: {passCount}</span> |{" "}
              <span className="text-red-500 dark:text-red-400">Failed: {failCount}</span> |{" "}
              <span className="text-yellow-600 dark:text-yellow-400">Pending: {pendingCount}</span>

            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resultAssignments?.map((assignment, index) => {
              const statusResult = getResultStatus(assignment)
              return (
                <Card
                  key={index}
                  className={`shadow-md rounded-2xl border ${statusResult.status === "Pass"
                    ? "border-green-200 dark:border-green-700"
                    : statusResult?.status === "Fail"
                      ? "border-red-200 dark:border-red-700"
                      : "border-yellow-200 dark:border-yellow-700"
                    } bg-white dark:bg-gray-800 hover:shadow-lg transition`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {assignment?.BatchAssignment?.Assignment?.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-1 rounded-full ${statusResult.status === "Pass"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                          : statusResult.status === "Fail"
                            ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                            : "bg-yellow-100 dark:bg-yellow-700 text-yellow-600 dark:text-yellow-400"
                          }`}
                      >
                        {statusResult.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Subject</strong>: {assignment?.BatchAssignment?.Assignment?.Subject?.subject_name}
                    </p>

                    <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4" />
                      {assignment?.BatchAssignment?.Assignment?.due_date}

                    </div>

                    <div className="text-sm space-y-1">
                      <p>
                        Passing Percentage:{" "}
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {assignment?.BatchAssignment?.Assignment?.min_percentage}%
                        </span>
                      </p>
                      <p>
                        Student Percentage:{" "}
                        <span
                          className={
                            statusResult.percentage >= assignment?.BatchAssignment?.Assignment?.min_percentage
                              ? "text-green-600 dark:text-green-400"
                              : statusResult.percentage === null
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-red-600 dark:text-red-400"
                          }
                        >
                          {statusResult.percentage || 0}%
                        </span>
                      </p>
                    </div>

                    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                      <SheetTrigger asChild>
                        <Button onClick={() => {
                          setSelectedAssignment(assignment)
                          setSelectedStatus(statusResult);
                        }} className="w-full mt-2 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800">
                          View Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto scrollbar-hide"
                        onInteractOutside={(e) => e.preventDefault()}>
                        {
                          selectedAssignment && (
                            <AssignmentDetails setOpenSheet={setOpenSheet} assignmentdetails={selectedAssignment} name={student_data.student?.Student.name} id={student_data.student?.Student.id} img={student_data.student?.Student.profile_image} batchName={assignment?.BatchAssignment?.Batch?.BatchesName} statusR={selectedStatus} />
                          )
                        }
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>

              )
            }

            )


            }
          </div>



          <div className="flex justify-center items-center gap-3 mt-5">
            <Button
              disabled={currentPageAss === 1}
              onClick={() => setCurrentPageAss((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span>
              Page {currentPageAss} of {totalPagesStu}
            </span>
            <Button
              disabled={currentPageAss === totalPagesStu}
              onClick={() => setCurrentPageAss((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>


        </TabsContent>



        <TabsContent value="exams" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize me-4 md:me-0">
              Total Exams: {totalR}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Attempted: {counts.pass + counts.fail} | Unattempted: {counts.unattempted} |{" "}
              <span className="text-green-600 dark:text-green-400">Passed: {counts.pass}</span> |{" "}
              <span className="text-red-500 dark:text-red-400">Failed: {counts.fail}</span>
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examDetails?.map((exam, index) => {
              return (
                <Card
                  key={index}
                  className={`shadow-md rounded-2xl border ${exam.status === "pass"
                    ? "border-green-200 dark:border-green-700"
                    : exam.status === "fail"
                      ? "border-red-200 dark:border-red-700"
                      : "border-gray-200 dark:border-gray-700"
                    } bg-white dark:bg-gray-800 hover:shadow-lg transition`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {exam?.exam_batch?.Exam?.exam_name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-1 rounded-full ${exam.status === "pass"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                          : exam.status === "fail"
                            ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                            : "bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400"
                          }`}
                      >
                        {exam.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Subject</strong>: {exam?.exam_batch.Exam?.Subject?.subject_name}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4" />
                      {exam?.exam_batch.Exam?.schedule_date}
                      <ClockIcon className="w-4 h-4 ml-4" />
                      {exam?.exam_batch.Exam?.start_time} to {exam?.exam_batch.Exam?.end_time}
                    </div>

                    <div className="text-sm space-y-1">
                      <p>
                        Passing Percentage:{" "}
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {exam?.exam_batch.Exam?.pass_percent}%
                        </span>
                      </p>
                      <p>
                        Student Percentage:{" "}
                        <span
                          className={
                            exam?.student_percent >= exam?.exam_batch.Exam?.pass_percent
                              ? "text-green-600 dark:text-green-400"
                              : exam?.student_percent === null
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-red-600 dark:text-red-400"
                          }
                        >
                          {exam?.student_percent || 0}%
                        </span>
                      </p>
                    </div>

                    <Sheet >
                      <SheetTrigger asChild>
                        <Button className="w-full mt-2 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800">
                          View Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto scrollbar-hide"
                        onInteractOutside={(e) => e.preventDefault()}>
                        <ExamResultDetails exam={exam} name={stuDetails.Student.name} id={stuDetails?.Student.id} img={stuDetails?.Student.profile_image} />
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>
              )
            })}
          </div>



          <div className="flex justify-center items-center gap-3 mt-5">
            <Button
              disabled={curntP === 1}
              onClick={() => setCurrentPageExam((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span>
              Page {curntP} of {totalP}
            </span>
            <Button
              disabled={curntP === totalP}
              onClick={() => setCurrentPageExam((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>


        </TabsContent>
      </Tabs>
    </div>
  );
}


//   pass failed in quizz