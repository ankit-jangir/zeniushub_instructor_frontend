import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import Header from "@/instructor/common/header/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchBatchSchema } from "@/instructor/zod_validations/Batch";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBatchDetails,
  fetchBatchesByCourseId,
  fetchBatchesBySession,
  fetchCourseById,
  getSession,
  promoteStudents,
} from "@/instructor/Redux/Api/Batch_Api";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import No_data_found from "@/instructor/common/no_data_found";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";

const Batch = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openDialogData, setOpenDialogData] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [getnewsession, setsessionYear] = useState();
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const {
    newBatch,
    batches,
    loading,
    error,
    batchDetails,
    courseDetails,
    mySession,
  } = useSelector((state) => state.Batch);
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const {
    register: registerSearchBatch,
    handleSubmit: handleSubmitSearchBatch,
    formState: { errors: errorsSearchBatch },
    watch,
  } = useForm({
    resolver: zodResolver(searchBatchSchema),
    mode: "onChange",
  });

  const searchBatchValue = watch("title");

  useEffect(() => {
    dispatch(getSession(token));
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!sessionID || !token) return;

      tryCatchWrapper(() =>
        dispatch(
          fetchBatchesBySession({
            sessionId: sessionID,
            search: searchBatchValue || "",
            token,
          })
        )
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchBatchValue, sessionID, token, dispatch]);

  useEffect(() => {
    if (openDialogData) {
      dispatch(
        fetchBatchDetails({
          id: openDialogData.id.toString(),
          SessionId: getnewsession,
          token,
        })
      );
    }
  }, [openDialogData, token, dispatch]);


  useEffect(() => {
    const courseId = batchDetails?.course_id;
    if (courseId) {
      dispatch(fetchCourseById({ courseId, token }));
    }
  }, [batchDetails, token, dispatch]);

  useEffect(() => {
    if (selectedCourseId) {
      dispatch(fetchBatchesByCourseId({ idcourse: selectedCourseId, token }));
    }
  }, [selectedCourseId, dispatch]);

  const handleCheckboxChange = (student, isChecked) => {
    if (isChecked) {
      setSelectedStudents((prev) => [...prev, student.student_id]);
    } else {
      setSelectedStudents((prev) =>
        prev.filter((id) => id !== student.student_id)
      );
    }
  };


  const buttonText =
    selectedStudents.length > 0
      ? selectedStudents
        .map(
          (studentId) =>
            batchDetails?.Course?.Student_Enrollments.find(
              (student) => student.student_id === studentId
            )?.Student?.name
        )
        .filter((name) => name !== undefined)
        .join(", ")
      : "Select Students";

  const handlePromote = async () => {
    const payload = {
      course_id: openDialogData?.course_id,
      batch_id: openDialogData?.id,
      session_id: getnewsession,
      new_course_id: selectedCourseId,
      new_batch_id: selectedBatchId,
      new_session_id: selectedSessionId,
      student_exclude: selectedStudents,
    };
    const result = await tryCatchWrapper(() => dispatch(promoteStudents({ payload, token })).unwrap());

    if (result.success) {
      setOpenDialogData(null);
      toast.success("promote successfully!");
      setSelectedStudents([])
      setSelectedSessionId(null)
      setSelectedBatchId(null)
      setSelectedCourseId(null)
      setsessionYear()
    }
  };




  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />

        <main className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold dark:text-white">Batches</h1>



            <div className="flex justify-end">
              <div className="flex items-center border border-blue-300 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 w-full max-w-md shadow-md">
                <Search
                  size={18}
                  className="text-gray-500 dark:text-gray-300"
                />
                <input
                  type="text"
                  placeholder="Search by Batch Name..."
                  className="ml-2 w-full outline-none bg-transparent text-sm text-gray-800 dark:text-gray-100"
                  {...registerSearchBatch("title")}
                />
              </div>
            </div>


            {errorsSearchBatch.title && (
              <p className="text-red-500 text-sm text-right">
                {errorsSearchBatch.title.message}
              </p>
            )}



            <div className="px-2 sm:px-4 md:px-6 lg:px-8">
              <div className="grid gap-6  justify-items-center      
                                           md:justify-start  grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                {loading ? (
                  <p className="text-center text-blue-600 dark:text-white col-span-full">
                    Loading...
                  </p>
                ) : error ? (
                  <p className="text-center text-red-500 col-span-full">

                    {error}
                  </p>
                ) : Array.isArray(batches) && batches.length > 0 ? (
                  batches.map((batch) => {
                    return (
                      <Card
                        key={batch.id}
                        className="w-full max-w-[300px] bg-white dark:bg-gray-900 shadow-md dark:shadow-blue-500/30 shadow-gray-500/50 rounded-2xl overflow-hidden h-full min-h-[230px] flex flex-col justify-between"

                      >
                        <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                          <CardTitle className="text-base font-semibold text-blue-800 dark:text-white">
                            <TooltipProvider>
                              <div className="flex items-center gap-4 justify-between">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="block truncate w-[130px]">
                                      {batch.batch.BatchesName}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-white text-gray-800 dark:bg-gray-700 dark:text-white rounded-md shadow-lg">
                                    {batch.batch.BatchesName}
                                  </TooltipContent>
                                </Tooltip>
                                <Button className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm w-fit hover:bg-green-600">
                                  {batch.batch.status}
                                </Button>
                              </div>
                            </TooltipProvider>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 py-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            Start Time:{" "}
                            <span className="font-medium">{batch?.batch?.StartTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            End Time:{" "}
                            <span className="font-medium">{batch?.batch?.EndTime}</span>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <Button
                              onClick={() => {
                                navigate(
                                  `/batch/viewdetails/${batch?.batch?.id}?sessionId=${batch?.session_Id}`
                                );
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                            >
                              View Details
                            </Button>

                            <Button
                              className="flex-1 bg-green-600 text-white hover:bg-green-500 hover:text-white px-3 py-2 rounded-lg text-sm"
                              onClick={() => {
                                setOpenDialogData(batch?.batch),
                                  setsessionYear(batch.session_Id);
                              }}
                            >
                              Promote
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
                    <No_data_found />
                  </p>
                )}

              </div>
            </div>
          </div>
        </main>

        {openDialogData && (
          <Dialog
            open={!!openDialogData}
            onOpenChange={(open) => !open && setOpenDialogData(null)}
          >

            <DialogContent className="w-[90vw] max-w-lg rounded-2xl p-6">

              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Promote Students
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Select New Course
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedCourseId(Number(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseDetails?.length ? (
                        courseDetails.map((course) => (
                          <SelectItem
                            key={course.id}
                            value={course.id.toString()}
                          >
                            {course.course_name}
                          </SelectItem>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 px-4 py-2 text-sm">
                          No course found
                        </p>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Select New Batch
                  </Label>
                  <Select
                    onValueChange={(value) => setSelectedBatchId(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(newBatch?.data) &&
                        newBatch.data.length > 0 ? (
                        newBatch.data.map((batch) => (
                          <SelectItem
                            key={batch.id}
                            value={batch.id.toString()}
                          >
                            <span className="truncate w-[400px]" title={batch.BatchesName}>  {batch.BatchesName}</span>
                          </SelectItem>
                        ))
                      ) : (
                        <p className="text-sm text-center px-4 py-2 text-gray-500">
                          No batches available
                        </p>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Select New Session
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedSessionId(Number(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose session" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(mySession).length > 0 ? (
                        <SelectItem
                          key={mySession.id}
                          value={mySession.id.toString()}
                        >
                          {mySession.session_year}
                        </SelectItem>
                      ) : (
                        <p className="text-sm text-center px-4 py-2 text-gray-500">
                          No sessions available
                        </p>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Exclude Students
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {buttonText}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {batchDetails?.total_student_count === 0 ? (
                          <label className="text-sm">No students in this batch</label>
                        ) : (
                          batchDetails?.Course?.Student_Enrollments?.map((student, idx) => (
                            <div
                              key={student.student_id || idx}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`stu-${idx}`}
                                className="accent-green-600"
                                checked={selectedStudents.includes(student.student_id)}
                                onChange={(e) =>
                                  handleCheckboxChange(student, e.target.checked)
                                }
                              />
                              <label htmlFor={`stu-${idx}`} className="text-sm">
                                {student?.Student?.name || "Unnamed Student"}
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

              </div>

              <DialogFooter className="mt-6">
                <Button
                  className="bg-green-600 text-white px-6"
                  onClick={handlePromote}
                >
                  Promote
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Batch;
