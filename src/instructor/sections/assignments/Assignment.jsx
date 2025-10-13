"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssignmentCard from "./components/AssignmentCard";
import { Search, FolderPlus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultipleSelect from "react-select";
import { components } from "react-select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAssignmentSchema, searchAssignmentsSchema } from "@/instructor/zod_validations/assignment";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import Header from "@/instructor/common/header/Header";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, fetchAssignmentsHistory, fetchAssignmentsUpcoming } from "@/instructor/Redux/Api/Assignments_api";
import NoDataFound from "@/instructor/common/NoDataFound";
import Loading from "@/instructor/common/Loading";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { get_batch, get_course, get_subject } from "@/instructor/Redux/Api/Quiz_api";
import { showToast } from "@/instructor/utils/ToastHandler";


const Assignment = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTitleUpcoming, setSearchTitleUpcoming] = useState("");
  const [searchTitleHistory, setSearchTitleHistory] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState();

  const { course, batch, subject } = useSelector((s) => s.quizzSlice);
  const batches = batch.map((batch) => ({ value: batch.id, label: batch.BatchesName }));

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const dispatch = useDispatch();
  const { assignmentsHistory, loadingHistory, totalHistory, assignmentsUpcoming, loadingUpcoming, totalUpcoming, loadingAdd, result_dec_percentage } = useSelector((state) => state.assignments);
  const limit = 6;
  const [pageHistory, setPageHistory] = useState(1);
  const [pageUpcoming, setPageUpcoming] = useState(1);

  const {
    register: registerSearchAssignments,
    setValue,
    formState: { errors: errorsSearchAssignments },
    trigger,
  } = useForm({
    resolver: zodResolver(searchAssignmentsSchema),
    defaultValues: { title: "" },
    mode: "onChange",
  });



  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!errorsSearchAssignments.title) {
        getAssignmentsUpcoming();
        getAssignmentsHistory();
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTitleHistory, searchTitleUpcoming, pageUpcoming, pageHistory, sessionID, errorsSearchAssignments.title]);

  const getAssignmentsHistory = async () => {
    if (sessionID) {
      await tryCatchWrapper(() => dispatch(fetchAssignmentsHistory({ token, payload: { page: pageHistory, limit, title: searchTitleHistory, session_id: sessionID } })).unwrap());
    }
  };

  const getAssignmentsUpcoming = async () => {
    if (sessionID) {
      await tryCatchWrapper(() => dispatch(fetchAssignmentsUpcoming({ token, payload: { page: pageUpcoming, limit, title: searchTitleUpcoming, session_id: sessionID } })).unwrap());
    }
  };

  const totalPagesHistory = Math.ceil(totalHistory / limit);
  const totalPagesUpcoming = Math.ceil(totalUpcoming / limit);




  const fetchCourses = async () => {

    await tryCatchWrapper(() => dispatch(get_course(token)).unwrap())

  };

  const fetchBatches = async () => {
    if (selectedCourseId) {
      await tryCatchWrapper(() =>
        dispatch(get_batch({ token, id: selectedCourseId })).unwrap())
    }
  };
  const fetchSubjects = async () => {
    if (selectedCourseId) {
      await tryCatchWrapper(() =>

        dispatch(get_subject({ token, id: selectedCourseId })).unwrap())
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchSubjects();
  }, [selectedCourseId]);




  const {
    register,
    handleSubmit,
    reset,
    setValue: setValueAddAssignments,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addAssignmentSchema),
    defaultValues: {
      title: "",
      total_marks: 100,
      min_percentage: 35,
      due_date: "",
      attachments: null,
      subject_id: 0,
      course_id: 0,
      batch_id: [],
    },
  });


  const onSubmit = async (details) => {
    const data = new FormData();
    data.append("course_id", details.course_id);
    data.append("due_date", details.due_date);
    data.append("subject_id", details.subject_id);
    data.append("total_marks", details.total_marks);
    data.append("title", details.title);
    data.append("batch_id", JSON.stringify(details.batch_id));
    data.append("min_percentage", details.min_percentage);
    data.append("session_id", sessionID);
    if (details.attachments) {
      data.append("attachments", details.attachments);
    }

    const result = await tryCatchWrapper(() => dispatch(addAssignment({ data, token })).unwrap())

    if (result.success) {
      const successMessage = result.data?.message;
      setIsDialogOpen(false);
      reset();
      getAssignmentsUpcoming()
      showToast(successMessage, "success", {
        position: "top-right",
        autoClose: 3000,
      });
    }



  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-6 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Assignments</h1>
            {selectedTab === "upcoming" && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => fetchCourses()} variant="blueHover" >
                    <FolderPlus /> Add Assignment
                  </Button>
                </DialogTrigger>


                <DialogContent
                  className="sm:max-w-[600px]"
                  onInteractOutside={(e) => e.preventDefault()}
                >

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-6">
                      <DialogTitle>Add Assignment</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new assignment. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="course_id">Course</Label>
                        <Select
                          onValueChange={(value) => {
                            const courseId = parseInt(value);
                            setSelectedCourseId(courseId);
                            setValueAddAssignments("course_id", courseId, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Courses</SelectLabel>
                              {course?.courses?.map((course) => (
                                <SelectItem
                                  key={course.id}
                                  value={course.id.toString()}
                                >
                                  <span className="truncate w-[200px]" title={course.course_name}>  {course.course_name}</span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.course_id && (
                          <p className="text-red-500 text-sm">
                            {errors.course_id.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="subject_id">Subject</Label>
                        <Select
                          onValueChange={(value) =>
                            setValueAddAssignments("subject_id", parseInt(value), {
                              shouldValidate: true,
                              shouldTouch: true,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Subjects</SelectLabel>
                              {subject?.map((subject) => (
                                <SelectItem
                                  key={subject.id}
                                  value={subject.id.toString()}
                                >
                                  <span className="truncate w-[200px]" title={subject.subject_name}>  {subject.subject_name}</span>

                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.subject_id && (
                          <p className="text-red-500 text-sm">
                            {errors.subject_id.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="attachments">Attachments</Label>
                        <Input
                          id="attachments"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            setValueAddAssignments("attachments", e.target.files?.[0] || null, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });
                          }}
                        />

                        {errors.attachments && (
                          <p className="text-red-500 text-sm">
                            {errors.attachments.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                          id="due_date"
                          type="datetime-local"
                          className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                          {...register("due_date")}
                          onFocus={(e) => e.target.showPicker()}
                        />
                        {errors.due_date && (
                          <p className="text-red-500 text-sm">{errors.due_date.message}</p>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="min_percentage">Min Percentage</Label>
                        <Input
                          id="min_percentage"
                          type="number"
                          placeholder="35"
                          {...register("min_percentage", { valueAsNumber: true })}
                        />
                        {errors.min_percentage && (
                          <p className="text-red-500 text-sm">
                            {errors.min_percentage.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="total_marks">Total Marks</Label>
                        <Input
                          id="total_marks"
                          type="number"
                          placeholder="100"
                          {...register("total_marks", { valueAsNumber: true })}
                        />
                        {errors.total_marks && (
                          <p className="text-red-500 text-sm">
                            {errors.total_marks.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Assignment name"
                          {...register("title")}
                        />

                        {errors.title && (
                          <p className="text-red-500 text-sm">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="batch_id">Batch</Label>
                        <MultipleSelect
                          options={batches.map((batch) => ({
                            ...batch,
                            label:
                              batch.label.length > 30
                                ? batch.label.substring(0, 30) + "..."
                                : batch.label,
                            fullLabel: batch.label,
                          }))}
                          isMulti
                          onChange={(selected) => {
                            const selectedValues = selected.map((item) => item.value);
                            setValueAddAssignments("batch_id", selectedValues, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });
                          }}
                          components={{
                            Option: (props) => (
                              <div title={props.data.fullLabel}>
                                <components.Option {...props} />
                              </div>
                            ),
                            SingleValue: (props) => (
                              <div title={props.data.fullLabel}>
                                <components.SingleValue {...props} />
                              </div>
                            ),
                            MultiValueLabel: (props) => (
                              <div title={props.data.fullLabel}>
                                <components.MultiValueLabel {...props} />
                              </div>
                            ),
                          }}
                          styles={{
                            control: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                backgroundColor: isDark ? "#1a2231" : "transparent",
                                boxShadow: 'none',
                                border: `2px solid ${isDark ? "#61656c" : "#efefef"}`,
                                borderColor: isDark ? 'white' : 'black',
                                color: isDark ? 'white' : 'black',
                              };
                            },
                            menu: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                backgroundColor: isDark ? '#000' : '#fff',
                                color: isDark ? 'white' : 'black',
                              };
                            },
                            option: (base, state) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                backgroundColor: state.isFocused
                                  ? isDark
                                    ? '#333'
                                    : '#eee'
                                  : isDark
                                    ? '#000'
                                    : '#fff',
                                color: isDark ? 'white' : 'black',
                                ':active': {
                                  backgroundColor: isDark ? '#333' : '#eee',
                                },
                                ':focus': {
                                  backgroundColor: isDark ? '#333' : '#eee',
                                }

                              };
                            },
                            multiValue: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                backgroundColor: isDark ? 'gray' : '#e2e8f0',
                              };
                            },
                            multiValueLabel: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                color: isDark ? 'white' : 'black',
                                maxWidth: "150px",        // <-- Limit width
                                overflow: "hidden",       // <-- Hide extra text
                                textOverflow: "ellipsis", // <-- Show "..."
                                whiteSpace: "nowrap",     // <-- Prevent line break
                              };
                            },
                            multiValueRemove: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                color: isDark ? 'white' : 'black',
                                ':hover': {
                                  backgroundColor: isDark ? '#555' : '#ccc',
                                  color: isDark ? 'white' : 'black',
                                },
                              };
                            },
                            singleValue: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                color: isDark ? 'white' : 'black',
                                maxWidth: "200px",        // <-- Adjust as needed
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              };
                            },
                            input: (base) => {
                              const isDark = document.documentElement.classList.contains("dark");
                              return {
                                ...base,
                                color: isDark ? 'white' : 'black',
                              };
                            },
                          }}
                        />


                        {errors.batch_id && (
                          <p className="text-red-500 text-sm">
                            {errors.batch_id.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button variant="blueHover" disabled={loadingAdd} type="submit">Add Assignment</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>

              </Dialog>
            )}
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between mb-6">
              <TabsList>
                <TabsTrigger value="upcoming" className={selectedTab === "upcoming" ? "text-blue-500 border-b-2" : "text-gray-500"}>Upcoming</TabsTrigger>
                <TabsTrigger value="history" className={selectedTab === "history" ? "text-blue-500 border-b-2" : "text-gray-500"}>History</TabsTrigger>
              </TabsList>
              <div className="w-full max-w-sm ms-4 md:ms-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder={selectedTab === "upcoming" ? "Search upcoming assignments..." : "Search missed assignments..."}
                    className={`pl-10 w-full ${errorsSearchAssignments.title ? "border border-red-500" : ""}`}
                    {...registerSearchAssignments("title")}
                    value={selectedTab === "upcoming" ? searchTitleUpcoming : searchTitleHistory}
                    onChange={(e) => {
                      setValue("title", e.target.value);
                      if (selectedTab === "upcoming") {
                        setSearchTitleUpcoming(e.target.value);
                        setPageUpcoming(1);
                      } else {
                        setSearchTitleHistory(e.target.value);
                        setPageHistory(1);
                      }
                      trigger("title");
                    }}

                  />
                </div>
                {errorsSearchAssignments.title && (
                  <p className="text-red-500 text-sm mt-1">{errorsSearchAssignments.title.message}</p>
                )}
              </div>

            </div>

            <TabsContent value="upcoming">
              {assignmentsUpcoming.length === 0 ? <NoDataFound /> : <><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">{assignmentsUpcoming.map((a, i) => <AssignmentCard key={i} {...a} getAssignmentsUpcoming={getAssignmentsUpcoming}
                getAssignmentsHistory={getAssignmentsHistory} result_dec_percentage={result_dec_percentage} />)}</div><Pagination><PaginationContent><PaginationItem><PaginationPrevious onClick={() => setPageUpcoming(p => Math.max(p - 1, 1))} disabled={pageUpcoming === 1} /></PaginationItem>{Array.from({ length: totalPagesUpcoming }, (_, i) => <PaginationItem key={i}><PaginationLink isActive={pageUpcoming === i + 1} onClick={() => setPageUpcoming(i + 1)}>{i + 1}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationNext onClick={() => setPageUpcoming(p => Math.min(p + 1, totalPagesUpcoming))} disabled={pageUpcoming === totalPagesUpcoming} /></PaginationItem></PaginationContent></Pagination></>}
            </TabsContent>

            <TabsContent value="history">
              {assignmentsHistory.length === 0 ? <NoDataFound /> : <><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">{assignmentsHistory.map((a, i) => <AssignmentCard key={i} {...a} getAssignmentsUpcoming={getAssignmentsUpcoming}
                getAssignmentsHistory={getAssignmentsHistory} result_dec_percentage={result_dec_percentage} />)}</div><Pagination><PaginationContent><PaginationItem><PaginationPrevious onClick={() => setPageHistory(p => Math.max(p - 1, 1))} disabled={pageHistory === 1} /></PaginationItem>{Array.from({ length: totalPagesHistory }, (_, i) => <PaginationItem key={i}><PaginationLink isActive={pageHistory === i + 1} onClick={() => setPageHistory(i + 1)}>{i + 1}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationNext onClick={() => setPageHistory(p => Math.min(p + 1, totalPagesHistory))} disabled={pageHistory === totalPagesHistory} /></PaginationItem></PaginationContent></Pagination></>}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Assignment;

