import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { CalendarIcon, ClockIcon, PlusIcon } from "lucide-react";
import { Eye } from "lucide-react";
import { useRef } from "react";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/instructor/common/header/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { Users } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { Percent } from "lucide-react";
import { FileText } from "lucide-react";
import { Book } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCheck } from "lucide-react";
import { addexamSchema } from "@/instructor/zod_validations/exam";
import History from "./History";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  addExam,
  deleteExam,
  fetchBatchDetailsById,
  fetchexam,
} from "../../../instructor/Redux/Api/Exam_api";
import { useSelector } from "react-redux";
import No_data_found from "@/instructor/common/no_data_found";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { ArrowBigRight } from "lucide-react";
import { User } from "lucide-react";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { showToast } from "@/instructor/utils/ToastHandler";
import {
  get_batch,
  get_course,
  get_subject,
} from "@/instructor/Redux/Api/Quiz_api";
import { fetchCategories } from "@/instructor/Redux/Api/Category";
import { toast } from "react-toastify";



export default function Exams() {
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.employee.token);

  const { categories } = useSelector((state) => state.category);

  const [openAdd, setOpenAdd] = useState(false);

  const [search, setsearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const batches = useSelector((state) => state.batch);
  const { course } = useSelector((s) => s.quizzSlice);
  const { subject } = useSelector((s) => s.quizzSlice);

  const { batch } = useSelector((s) => s.quizzSlice);
  const [currentpage, setcurrentpage] = useState(1);
  const [addexam, setaddexam] = useState({
    subject_id: "",
    course_id: "",
    category_id: 1,
    exam_name: "",
    total_marks: "",
    pass_percent: "",
    ques_paper: "",
    start_time: "",
    end_time: "",
    schedule_date: "",
    batches: [],
    session_id: sessionID,
  });

  const toggleSubject = (value) => {
    setSelectedSubjects((prev) => {
      const newValues = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      form.setValue("subjects", newValues); 
      return newValues;
    });
  };

  const toggleBatch = (value) => {
    setSelectedBatches((prev) => {
      const newValues = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      form.setValue("batch", newValues); 
      return newValues;
    });
  };
  const startRef = useRef(null);
  const endRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(addexamSchema),
    defaultValues: {
      ques_paper: undefined,
      exam_name: "",
      course_id: "",
      category_id: "",
      subject_id: "",
      batches: [],
      total_marks: "",
      pass_percent: "",
      schedule_date: "",
      start_time: "",
      end_time: "",
    },
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const { exam, loading, error } = useSelector((s) => s.exam);
  const { batchDetails } = useSelector((s) => s.exam);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await tryCatchWrapper(() =>
        dispatch(get_course(token)).unwrap()
      );
    };

    fetchCourses();
  }, [dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCourseId) return;

      setSelectedSubjects([]);
      setSelectedBatches([]);

      form.setValue("subjects", []);
      form.setValue("batch", []);

      await tryCatchWrapper(() =>
        Promise.all([
          dispatch(get_subject({ token, id: selectedCourseId })).unwrap(),
          dispatch(get_batch({ token, id: selectedCourseId })).unwrap(),
        ])
      );
    };

    fetchData();
  }, [selectedCourseId]);
  useEffect(() => {
    if (selectedSubjects.length > 0) {
      form.setValue("subject_id", Number(selectedSubjects[0])); 
    }
  }, [selectedSubjects]);


  useEffect(() => {
    form.setValue("batches", selectedBatches.map(Number));
  }, [selectedBatches]);

  const onSubmit = async (data) => {

    const formData = new FormData();

    formData.append("exam_name", data.exam_name);
    formData.append("course_id", JSON.stringify(data.course_id)); 
    formData.append("category_id", String(data.category_id));
    formData.append("total_marks", data.total_marks.toString());
    formData.append("pass_percent", data.pass_percent.toString());
    formData.append("schedule_date", data.schedule_date);
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("employee_id", "5");
    formData.append("session_id", sessionID.toString());

    if (data.ques_paper instanceof File) {
      formData.append("ques_paper", data.ques_paper);
    } else {
      console.warn("❌ No file or not a File object", data.ques_paper);
    }

    formData.append("subject_id", String(data.subject_id));
    formData.append("batches", JSON.stringify(data.batches));     

    for (const [key, val] of formData.entries()) {
      console.log("📦", key, val);
    }

    const result = await tryCatchWrapper(() => dispatch(addExam({ examData: formData, token })).unwrap());

    if (result.success) {
      setOpenAdd(false);
      toast.success("Exam created successfully!");
      await dispatch(
        fetchexam({
          sesion_id: sessionID,
          token,
          exam_name: search,
          page: currentpage,
          limit,
        })
      )
      form.reset({
        exam_name: "",
        course_id: "",
        category_id: "",
        subject_id: "",
        batches: [],
        total_marks: "",
        pass_percent: "",
        schedule_date: "",
        start_time: "",
        end_time: "",
        ques_paper: undefined,
      });
      setSelectedSubjects([]);
      setSelectedBatches([]);
      setSelectedCourseId(null);
      // setQuizPayload(quizData);
    }
  };


  const fetchexams = async () => {
    if (sessionID) {
      await tryCatchWrapper(() =>
        dispatch(
          fetchexam({
            sesion_id: sessionID,
            token,
            exam_name: search,
            page: currentpage,
            limit,
          })
        ).unwrap()
      );
    }
  };

  useEffect(() => {
    fetchexams();
  }, [dispatch, search, sessionID, currentpage]);

  const handleDelete = async (id) => {
    if (!id) return;

    await tryCatchWrapper(async () => {
      await dispatch(deleteExam({ id, token })).unwrap();
      showToast("Exam deleted successfully", "success");
      await fetchexams();
    });
  };


  const paginatedData = exam?.data || [];

  const totalItems = exam?.totalRecords || 0;
  const totalPages = exam?.totalPages || 1;
  const currentPage = exam?.currentPage || 1;
  const limit = 6;

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Tabs defaultValue="Schedule Exams" className="w-full space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <TabsList className="flex gap-2 bg-white/80 w-full dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                  <TabsTrigger
                    className="px-4 py-4 rounded-sm font-medium text-gray-700 dark:text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
                    value="Schedule Exams"
                  >
                    Schedule Exams
                  </TabsTrigger>
                  <TabsTrigger
                    className="px-4 py-4 rounded-md font-medium text-gray-700 dark:text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
                    value="History"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="Schedule Exams">
                <div className="flex items-center gap-3 xl:justify-end">
                  <Input
                    value={search}
                    onChange={(e) => {
                      setsearch(e.target.value);
                      setcurrentpage(1);
                    }}
                    placeholder="Search exams…"
                    className="w-full xl:w-72 bg-white/90 dark:bg-gray-800/90
                  border border-gray-200 dark:border-gray-700
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500
                  transition-all duration-200"
                  />
                  <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setOpenAdd(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold">
                        <PlusIcon size={18} /> Add Exam
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      onPointerDownOutside={(e) => e.preventDefault()}
                      onEscapeKeyDown={(e) => e.preventDefault()}
                      className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6"
                    >
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Add New Exam
                        </DialogTitle>
                      </DialogHeader>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-5"
                        >
                          
                          <FormField
                            control={form.control}
                            name="exam_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exam Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Exam Name"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setaddexam((prev) => ({
                                        ...prev,
                                        exam_name: e.target.value,
                                      }));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                       
                          <FormField
                            control={form.control}
                            name="course_id"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="font-medium">
                                  Select Course
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedCourseId(value);
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Choose course" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="w-full">
                                    {course?.courses?.length > 0 ? (
                                      course.courses.map((courseItem) => (
                                        <SelectItem
                                          key={courseItem.id}
                                          value={String(courseItem.id)}
                                        >
                                         <span className="truncate w-[360px]" title= {courseItem.course_name}> {courseItem.course_name}</span>
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem disabled value="no-course">
                                        No courses found
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        
                          <div className="space-y-2 w-full">
                            <FormLabel className="font-medium">
                              Select Batches
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between"
                                >
                                  {selectedBatches.length > 0
                                    ? `${selectedBatches.length} Batch${selectedBatches.length > 1 ? "es" : ""
                                    } Selected`
                                    : "Select Batches"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-full sm:w-[380px] max-w-[95vw] p-2"
                                sideOffset={0}
                                align="start"
                              >
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {batch?.length > 0 ? (
                                    batch.map((batchItem) => (
                                      <label
                                        key={batchItem.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <Checkbox
                                          checked={selectedBatches.includes(
                                            batchItem.id
                                          )}
                                          onCheckedChange={() =>
                                            toggleBatch(batchItem.id)
                                          }
                                        />
                                        <span title={batchItem.BatchesName}>
                                          {batchItem.BatchesName}
                                        </span>
                                      </label>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                      No batches found
                                    </p>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage>
                              {form.formState.errors.batches?.message}
                            </FormMessage>
                          </div>

                          <FormField
                            control={form.control}
                            name="batches"
                            render={({ field }) => {
                              useEffect(() => {
                                form.setValue("batches", selectedBatches);
                              }, [selectedBatches]);

                              return <input type="hidden" {...field} />;
                            }}
                          />

                          
                          <FormField
                            control={form.control}
                            name="subject_id"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="font-medium">Select Subject</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value); 
                                    setSelectedSubjects([value]); 
                                  }}
                                  value={field.value ? String(field.value) : ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Choose Subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="w-full">
                                    {subject?.length > 0 ? (
                                      subject.map((sub) => (
                                        <SelectItem key={sub.id} value={String(sub.id)}>
                                        <span className="truncate w-[350px]" title={sub.subject_name}>  {sub.subject_name}</span>
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem disabled value="no-subject">
                                        No subjects found
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                      
                          <FormField
                            control={form.control}
                            name="subject_id"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormControl>
                                  <Input
                                    type="hidden"
                                    {...field}
                                    value={selectedSubjects}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          
                          <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value); 
                                  }}
                                  value={field.value ? String(field.value) : ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="w-full">
                                    {categories?.data?.map((cat) => (
                                      <SelectItem
                                        key={cat.id}
                                        value={String(cat.id)} 
                                      >
                                       <span className="truncate w-[350px]" title={cat.name}> {cat.name}</span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                          
                          <FormField
                            control={form.control}
                            name="total_marks"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total Marks</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Total Marks"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setaddexam((prev) => ({
                                        ...prev,
                                        total_marks: parseInt(e.target.value),
                                      }));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                         
                          <FormField
                            control={form.control}
                            name="schedule_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exam Date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"

                                    {...field}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setaddexam((prev) => ({
                                        ...prev,
                                        schedule_date: e.target.value,
                                      }));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        
                          <div className="flex gap-4">
                            <FormField
                              control={form.control}
                              name="start_time"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Start Time</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"

                                      {...field}
                                      ref={startRef}
                                      onClick={() =>
                                        startRef.current?.showPicker()
                                      }
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setaddexam((prev) => ({
                                          ...prev,
                                          start_time: e.target.value,
                                        }));
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="end_time"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>End Time</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"

                                      {...field}
                                      ref={endRef}
                                      onClick={() =>
                                        endRef.current?.showPicker()
                                      }
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setaddexam((prev) => ({
                                          ...prev,
                                          end_time: e.target.value,
                                        }));
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>


                          <FormField
                            control={form.control}
                            name="ques_paper"
                            render={({ field: { onChange, ref } }) => (
                              <FormItem>
                                <FormLabel>Upload Question Paper</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      console.log("📂 Selected file:", file);
                                      onChange(file);
                                    }}
                                    ref={ref}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                          <FormField
                            control={form.control}
                            name="pass_percent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Passing Percentage</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Passing Percentage"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setaddexam((prev) => ({
                                        ...prev,
                                        pass_percent: parseInt(e.target.value),
                                      }));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Save Exam
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <h2 className="mt-6 mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  Scheduled Exams
                </h2>
                {
                  paginatedData.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg">
                      <No_data_found />
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                        {paginatedData?.map((exam) => (
                          <Card
                            key={exam?.id}
                            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-md dark:shadow-blue-500/50"
                          >
                            <CardHeader className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <CardTitle
                                  className="text-xl mb-4 font-semibold text-gray-900 dark:text-gray-100 truncate"
                                  title={exam?.exam_name}
                                >
                                  {exam?.exam_name}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  <p  className="truncate w-[300px]"
                                    title={exam?.Subject?.subject_name}><strong>Subject</strong>: {exam?.Subject?.subject_name}</p>
                                  <p
                                    className="truncate w-[300px]"
                                    title={exam?.Course?.course_name}
                                  >
                                    <strong>Course</strong>: {exam?.Course?.course_name}
                                  </p>
                                </CardDescription>
                              </div>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white hover:text-white flex items-center gap-2 px-3 py-2 rounded-md"
                                  >
                                    <span className="hidden md:inline">
                                      Delete
                                    </span>
                                    <Trash size={18} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                                      This action cannot be undone. This will
                                      permanently delete the exam{" "}
                                      <strong>{exam?.exam_name}</strong> and
                                      remove its data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-md">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700 text-white rounded-md"
                                      onClick={() => handleDelete(exam.id)}
                                    >
                                      Yes, Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2 rounded-lg shadow-md transform"
                                    onClick={() => {
                                      dispatch(
                                        fetchBatchDetailsById({
                                          id: exam?.id,
                                          token,
                                        })
                                      );
                                    }}
                                  >
                                    <Eye size={16} /> View Details
                                  </Button>
                                </SheetTrigger>

                                <SheetContent className="bg-white dark:bg-gray-900 border-l border-gray-200/50 dark:border-gray-700/50 w-full max-w-md p-6 sm:p-8 overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                  <SheetHeader>
                                    <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/50 pb-4 flex items-center space-x-3">
                                      <FileText className="w-6 h-6" />
                                      <span>{exam.name} Details</span>
                                    </SheetTitle>
                                  </SheetHeader>

                                  <div className="mt-6 space-y-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            Exam Name:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                                            {exam?.exam_name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>


                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div className="flex items-center">
                                          <span className="font-semibold text-gray-800 dark:text-gray-100 inline-block">
                                            Subject:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300 truncate inline-block" style={{ maxWidth: '170px' }} title={exam?.Subject?.subject_name}>
                                            {exam?.Subject?.subject_name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>



                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div className="flex items-center">
                                          <span className="font-semibold text-gray-900 dark:text-gray-100 inline-block">
                                            Course:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300 truncate inline-block" style={{ maxWidth: '170px' }} title={exam?.Course?.course_name}>
                                            {exam?.Course?.course_name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>


                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-start space-x-3">
                                        <Users className="w-5 h-5 mt-1 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                                            Batches:
                                          </span>
                                          <ol className="max-h-24 overflow-y-auto scrollbar-hide mt-1 space-y-1 list-disc list-inside scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 pr-2">
                                            {exam?.exam_batches?.map((b, i) => (
                                              <li
                                                key={i}
                                                className="text-gray-700 dark:text-gray-300"
                                              >
                                                {b.Batch.BatchesName}
                                              </li>
                                            ))}
                                          </ol>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            Date:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                                            {exam?.schedule_date}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            Time:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                                            {new Date(
                                              `1970-01-01T${exam?.start_time}`
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}{" "}
                                            -{" "}
                                            {new Date(
                                              `1970-01-01T${exam?.end_time}`
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <ArrowBigRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                                            Total Marks:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                                            {exam?.total_marks}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <Percent className="w-5 h-4 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            Passing Percentage:
                                          </span>
                                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                                            {exam?.pass_percent}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            Uploaded File:
                                          </span>
                                          <a

                                            href={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${exam?.ques_paper}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                                          >
                                            View File
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
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
              </TabsContent>

              <TabsContent value="History">
                <History />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
