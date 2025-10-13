import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Search, Calendar, FileText, BookOpen, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import Header from "@/instructor/common/header/Header";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  homeworkSchema,
  schema,
  searchDetailSchema,
} from "@/instructor/zod_validations/Batch";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBatchDetails } from "@/instructor/Redux/Api/Batch_Api";
import { useSelector } from "react-redux";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { fetchAssignmentsByBatch } from "@/instructor/Redux/Api/Assignments_api";
import { fetchQuizzes } from "@/instructor/Redux/Api/Quiz_api";
import { setPage } from "@/instructor/Redux/Slice/Quiz_slice";
import No_data_found from "@/instructor/common/no_data_found";
import { CalendarIcon } from "lucide-react";
import { ClockIcon } from "lucide-react";
import { FileQuestionIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { fetchExamss } from "@/instructor/Redux/Api/Exam_api";
import { setPageExam } from "@/instructor/Redux/Slice/Exam_slice";

const ViewDetail = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  const tabs = ['Overview', 'Assignments', 'Quizzes', 'Exam']
  const [selectedDate, setSelectedDate] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const back = () => navigate("/batches");
  const [currentPageAss, setCurrentPageAss] = useState(1);
  const dispatch = useDispatch();
  const { assignmentsBatch, loadingBatch, pageAss, limitAss, totalAss } = useSelector(
    (state) => state.assignments
  );

  const totalPagesAss = Math.ceil(totalAss / limitAss);


  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const { loadingBatchQuiz, quizBatch, currentPage, pageSize, total, totalPages } = useSelector(
    (state) => state.quizzSlice
  );
  const SessionId = queryParams.get("sessionId");

  const sessionID = useSelector((state) => state.session?.selectedSession);



  const fetchExamssss = async () => {
    if (id) {
      await tryCatchWrapper(() =>

        dispatch(fetchExamss({ sessionId: sessionID || SessionId, batchId: id, page: pagination.page, limit: pagination.limit, token })).unwrap())
    }
  };



  const { examsBatch, loadingBatchExam, pagination } = useSelector((state) => state.exam);


  const { page, totalPagesExam } = pagination;


  const fetchQuizzesss = async () => {
    if (id) {
      await tryCatchWrapper(() =>

        dispatch(fetchQuizzes({ sessionId: sessionID || SessionId, batchId: id, page: currentPage, pageSize, token })).unwrap())
    }
  };


  const ass = 6;
  const fetchAssignmentsByBatchss = async () => {
    if (id) {
      await tryCatchWrapper(() =>
        dispatch(fetchAssignmentsByBatch({
          id,
          sessionId: sessionID || SessionId,
          page: currentPageAss,
          limit: ass,
          token
        })).unwrap()
      )
    }
  };



  useEffect(() => {
    fetchQuizzesss()
    fetchExamssss()
    fetchAssignmentsByBatchss()
  }, [dispatch, SessionId, id, currentPage, currentPageAss, pageSize, ass, pagination.page, sessionID]);





  const { batchDetails } = useSelector((state) => state.Batch || {});

  const {
    register: registerSearchDetail,
    formState: { errors: errorsSearchDetail },
    watch,
  } = useForm();

  const fetchBatchDetailsById = async () => {
    if (!id || !SessionId) {
      console.error("Missing id or sessionId", { id, SessionId });
      return;
    }

    await tryCatchWrapper(() =>
      dispatch(fetchBatchDetails({ id, token, SessionId })).unwrap()
    );
  };

  useEffect(() => {
    fetchBatchDetailsById();
  }, [dispatch, id, token, SessionId]);

  const filteredStudents =
    batchDetails?.Course?.Students?.filter((student) =>
      student.name.toLowerCase().includes(watch("title")?.toLowerCase() || "")
    ) || [];

  const subjects =
    batchDetails?.Course?.SubjectCourses?.map(
      (sc) => sc.Subject.subject_name
    ) || [];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(homeworkSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    setOpen(false);
    reset();
  };

  const {
    register: registershowHomeWork,
    handleSubmit: handleSubmitshowHomeWork,
    formState: { errors: errorsshowHomeWork },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmits = (data) => {
    setShowDetails(true);
  };

  //   register: registerSearchDetail,
  //   handleSubmit: handleSubmitSearchDetail,
  //   formState: { errors: errorsSearchDetail},
  //   watch
  // } = useForm({
  //   resolver: zodResolver(searchDetailSchema),
  // });

  const onValidSearch = (data) => {
    console.log("Valid search input:", data);
  };

  const onInvalidSearch = (errors) => {
    console.log("Validation Errors:", errors);
  };

  const searchDetailValue = watch("title");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchDetailValue?.trim().length > 0) {
        handleSubmitSearchDetail(onValidSearch, onInvalidSearch)();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchDetailValue]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-6 md:p-10 lg:p-8 space-y-10  transition-all duration-300">
          <div className="mb-5">
            <Button
              onClick={back}
              className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2  rounded-md text-sm flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Back to batches</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h4 className="text-4xl font-medium tracking-tight">Details</h4>

              <p className="text-gray-800 dark:text-white text-sm">
                Manage your quizes, exams, students, and assignments with ease.
              </p>
            </div>

          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-6 bg-transparent border-b border-gray-300 p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.toLowerCase()}
                  value={tab.toLowerCase()}
                  className="px-4 py-2 text-gray-600 font-medium transition-colors duration-150 
                data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                hover:text-blue-500"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-5">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 dark:text-white text-sm mb-1">Course</p>
                  <p className="font-semibold text-xl text-gray-800 dark:text-white">
                    {batchDetails?.Course?.course_name}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white ">Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className=" text-gray-800 dark:text-white ">
                    {subjects.map((subject, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-blue-600 me-4" />
                        {subject}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white ">
                    Batch Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-white">
                    <h2><strong>Batch Name</strong>:{" "}{batchDetails?.BatchesName}</h2>

                    <p>
                      <strong>Total Students:</strong>{" "}
                      {batchDetails?.total_student_count}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white ">
                    My Students
                  </CardTitle>

                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-md">
                    <table className="min-w-full text-sm text-center">
                      <thead className="border-b uppercase tracking-wide">
                        <tr>
                          <th className="px-6 py-4">enrollment_id</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">contact_no</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {batchDetails?.Course?.Student_Enrollments.length >
                          0 ? (
                          batchDetails?.Course?.Student_Enrollments.map(
                            (student, idx) => (
                              <tr key={idx} className="transition duration-150">
                                <td className="px-6 py-4 text-gray-800 dark:text-white capitalize font-semibold">
                                  {student?.Student?.enrollment_id}
                                </td>
                                <td className="px-6 py-4 text-gray-800 dark:text-white capitalize font-semibold truncate w-[400px] inline-block" title={student?.Student?.name}>
                                  {student?.Student?.name}
                                </td>

                                <td className="px-6 py-4 text-gray-800 dark:text-white capitalize font-semibold">
                                  {student?.Student?.contact_no}
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() =>
                                      navigate("/student/profile", {
                                        state: {
                                          from: "batches",
                                          studentId: student?.id,
                                        },
                                      })
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                  >
                                    View Profile
                                  </button>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="2"
                              className="px-6 py-6 text-center text-gray-500"
                            >
                              No students found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Assignments Tab */}
            <TabsContent value="assignments">
              {assignmentsBatch && assignmentsBatch.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {
                    assignmentsBatch?.map((a) => (
                      <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CardContent className="p-5 space-y-4">
                          {/* Title + Status */}
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate w-[200px]" title={a.title}>
                              {a.title}
                            </h2>

                            {/* Status Badge */}
                            {a.is_result_dec ? (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
                                Declared
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">
                                Pending
                              </span>
                            )}
                          </div>

                          {/* Course & Subject */}
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Course</strong>:{" "}
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {a.course_name || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Subject</strong>:{" "}
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {a.subject_name || "N/A"}
                            </span>
                          </p>

                          {/* Date */}
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{a.due_date}</span>
                          </div>

                          {/* Marks */}
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Total Marks:{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {a.total_marks}
                            </span>
                          </p>

                          {/* Percentages + Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Passing Percentage:
                              </span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {a.min_percentage}%
                              </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${a.min_percentage || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                    ))
                  }
                </div>
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">
                  <No_data_found />
                </div>
              )}


              <div className="flex justify-center items-center gap-3 mt-5">
                <Button
                  disabled={pageAss === 1}
                  onClick={() => setCurrentPageAss(currentPageAss - 1)}
                >
                  Prev
                </Button>
                <span>
                  Page {pageAss} of {totalPagesAss}
                </span>
                <Button
                  disabled={pageAss === totalPagesAss}
                  onClick={() => setCurrentPageAss(currentPageAss + 1)}
                >
                  Next
                </Button>
              </div>

            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes">
              {quizBatch && quizBatch.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {
                    quizBatch?.map((exam) => (
                      <Card
                        key={exam.id}
                        className="w-full bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-md dark:shadow-blue-500/50"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                              {exam.title}
                            </CardTitle>

                          </div>

                          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p className="text-base">
                              <span className=" font-medium text-gray-800 dark:text-gray-300">
                                Course:
                              </span>{" "}
                              {exam.course_name}
                            </p>

                            <div className="max-h-24 overflow-y-auto scrollbar-hide border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-800">
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Subjects:
                              </p>
                              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm">
                                {exam?.subjects?.map((subject, index) => (
                                  <li key={index}>{subject}</li>
                                ))}
                              </ul>
                            </div>
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                          <p className="flex items-center gap-2">
                            <CalendarIcon size={16} className="text-blue-500" />
                            <span className="font-medium">Schedule:</span>{" "}
                            {exam.quizz_date}
                          </p>
                          <p className="flex items-center gap-2">
                            <ClockIcon size={16} className="text-blue-500" />
                            <span className="font-medium">Duration:</span>{" "}
                            {exam.quizz_time}
                          </p>
                          <p className="flex items-center gap-2">
                            <FileQuestionIcon size={16} className="text-blue-500" />
                            <span className="font-medium">Questions:</span>{" "}
                            {exam.total_question}
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

                        </CardFooter>
                      </Card>
                    ))
                  }
                </div>
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">
                  <No_data_found />
                </div>
              )}
              <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button className="cursor-pointer border p-2"
                  onClick={() => dispatch(setPage(currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                <span style={{ margin: "0 30px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button className="cursor-pointer border p-2"
                  onClick={() => dispatch(setPage(currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>



            </TabsContent>

            {/* Exam Tab */}
            <TabsContent value="exam">
              {examsBatch && examsBatch.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {
                    examsBatch?.map((exam) => (
                      <Card
                        key={exam?.id}
                        className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-md dark:shadow-blue-500/50"
                      >
                        <CardHeader className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <CardTitle
                              className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate w-[300px]"
                              title={exam?.exam_name}
                            >
                              {exam?.exam_name}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <p  className="truncate"
                                title={exam?.Subject?.subject_name}><strong>Subject</strong>: {exam?.Subject?.subject_name}</p>
                              <p
                                className="truncate"
                                title={exam?.Course?.course_name}
                              >
                                <strong>Course</strong>: {exam?.Course?.course_name}
                              </p>
                            </CardDescription>
                          </div>


                        </CardHeader>

                        <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                          <p className="flex items-center gap-2">
                            <CalendarIcon
                              size={16}
                              className="text-blue-500"
                            />
                            Date: {exam?.schedule_date}
                          </p>
                          <p className="flex items-center gap-2">
                            <ClockIcon size={16} className="text-blue-500" />
                            <span className="font-medium">Time:</span>
                            <span>
                              {new Date(
                                `1970-01-01T${exam?.start_time}`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            <span className="mx-1">to</span>
                            <span>
                              {new Date(
                                `1970-01-01T${exam?.end_time}`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </p>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3">
                          <div className="w-full">
                            <Progress
                              value={exam?.pass_percent}
                              className="h-2 w-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                              Passing Percentage: {exam?.pass_percent}%
                            </span>
                          </div>


                        </CardFooter>
                      </Card>
                    ))
                  }
                </div>
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">
                  <No_data_found />
                </div>
              )}
              <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <button
                  className="cursor-pointer border p-2"
                  onClick={() => dispatch(setPageExam(page - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span style={{ margin: "0 30px" }}>
                  Page {page} of {totalPagesExam}
                </span>
                <button
                  className="cursor-pointer border p-2"
                  onClick={() => dispatch(setPageExam(page + 1))}
                  disabled={page >= totalPagesExam}
                >
                  Next
                </button>
              </div>



            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ViewDetail;
