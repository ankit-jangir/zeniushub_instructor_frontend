import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
  DialogTitle,
  DialogTrigger,
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
import { CalendarIcon, ClockIcon, FileText, Calendar, Clock, FileQuestionIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addexamSchema, addquizpSchema } from "@/instructor/zod_validations/exam";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuiz,
  deleteQuiz,
  fetchQuizz,
  get_batch,
  get_course,
  get_quiz_by_id,
  get_subject,
} from "../../../instructor/Redux/Api/Quiz_api";
import { useParams } from "react-router-dom";
import No_data_found from "@/instructor/common/no_data_found";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { toast } from "react-toastify";
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
import logo from "../../../assets/logo/image.png";
import { showToast } from "@/instructor/utils/ToastHandler";

const ScheduledQuizzes = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee.token);
  const sessionID = useSelector((state) => state.session?.selectedSession);

  const dispatch = useDispatch();
  const [rules, setRules] = useState([""]);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [composition, setComposition] = useState({});
  const [page, setPage] = useState(1);
  const [open, setopen] = useState(false);
  const [quizPayload, setQuizPayload] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { data, loading, error, quiz } = useSelector((s) => s.quizzSlice);
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.error?.length > 0
        ? error.error[0]?.message
        : error?.message || "Something went wrong. Please try again.";
  const { course } = useSelector((s) => s.quizzSlice);
  const { subject } = useSelector((s) => s.quizzSlice);
  const { batch } = useSelector((s) => s.quizzSlice);

  const Data = data?.data || [];
  const totalItems = data?.pagination?.totalRecords || 0;
  const limit = 6; 
  const startIndex = (page - 1) * limit;
  const paginatedData = Data.slice(startIndex, startIndex + limit); 
  const totalPages = Math.ceil(totalItems / limit);

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

  useEffect(() => {
    if (selectedSubjects.length === 0 || !subject) return;

    const equalPercent = +(100 / selectedSubjects.length).toFixed(2);
    const initial = selectedSubjects.reduce((acc, subjId) => {
      const foundSubject = subject.find((s) => s.id === subjId);
      if (foundSubject) {
        acc[foundSubject.subject_name] = equalPercent;
      }
      return acc;
    }, {});

    setComposition(initial);
    form.setValue("composition", initial);
  }, [selectedSubjects, subject]);

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
    form.setValue("subjects", selectedSubjects);
  }, [selectedSubjects]);

  useEffect(() => {
    form.setValue("batch", selectedBatches);
  }, [selectedBatches]);

  useEffect(() => {
    if (Object.keys(composition).length > 0) {
      form.setValue("composition", composition, { shouldValidate: true });
    }
  }, [composition]);

  useEffect(() => {
    tryCatchWrapper(async () => {
      await dispatch(
        fetchQuizz({
          token,
          title: searchTerm,
          page,
          limit,
          session_id: sessionID || 13
        })
      ).unwrap();
    });
  }, [dispatch, searchTerm, page, sessionID]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages]);

  const handleSliderChange = (changedSubjectName, newVal) => {
    const others = Object.keys(composition).filter((key) => key !== changedSubjectName);
    const totalOfOthers = others.reduce((sum, key) => sum + composition[key], 0);

    let updated = { ...composition };
    updated[changedSubjectName] = newVal;

    let remaining = 100 - newVal;
    let sum = newVal;

    others.forEach((key, index) => {
      if (index === others.length - 1) {
        updated[key] = +(100 - sum).toFixed(2);
      } else {
        const share = totalOfOthers === 0 ? 1 / others.length : composition[key] / totalOfOthers;
        const val = +(remaining * share).toFixed(2);
        updated[key] = val;
        sum += val;
      }
    });

    setComposition(updated);
  };

  const dateRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(addquizpSchema),
    defaultValues: {
      name: "",
      course: "",
      subjects: [],
      batch: [],
      rules: [""],
      timePerQuestion: "",
      passing: "",
      date: "",
      duration_hours: "0",
      duration_minutes: "0",
      qust_num: "",
      composition: {},
    },
  });

  useEffect(() => {
    if (openAdd) {
      form.reset({
        name: "",
        course: "",
        subjects: [],
        batch: [],
        rules: [""],
        timePerQuestion: "",
        passing: "",
        date: "",
        duration_hours: "0",
        duration_minutes: "0",
        qust_num: "",
        composition: {},
      });
      setRules([""]);
      setSelectedSubjects([]);
      setSelectedBatches([]);
      setComposition({});
      setSelectedCourseId(null);
      setSelectedSubject(null);
    }
  }, [openAdd, form]);

  const handleRuleChange = (index, value) => {
    const updatedRules = [...rules];
    updatedRules[index] = value;
    setRules(updatedRules);
    form.setValue("rules", updatedRules);
  };

  const addRule = () => {
    setRules([...rules, ""]);
  };

  const removeRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    form.setValue("rules", updatedRules);
  };

  const formatDateToLocalString = (dateStr) => {
    const date = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const onSubmit = async (values) => {
    const {
      name,
      course,
      rules,
      timePerQuestion,
      passing,
      qust_num,
      date,
      duration_hours,
      duration_minutes,
      composition,
      subjects,
      batch,
    } = values;

    const totalDuration = parseInt(duration_hours) * 60 + parseInt(duration_minutes);
    const subjectIds = subjects.map((id) => Number(id));
    const batchIds = batch.map((id) => Number(id));

   
    const parsedComposition = Object.entries(composition).map(([subjectName, value]) => {
      const foundSubject = subject.find((s) => s.subject_name === subjectName);
      return foundSubject ? { [foundSubject.id]: Number(value) } : { [subjectName]: Number(value) };
    });

    const formattedDate = formatDateToLocalString(date);

    const quizData = {
      title: name,
      course_id: Number(course),
      subjects: subjectIds,
      batch_id: batchIds,
      quizz_rules: rules.filter((r) => r.trim() !== ""),
      session_id: sessionID,
      quizz_timing: formattedDate,
      time_period: totalDuration,
      passing_percentage: Number(passing),
      total_question: Number(qust_num),
      timePerQuestion: timePerQuestion ? Number(timePerQuestion) : null,
      subject_compostition: parsedComposition,
    };

    const result = await tryCatchWrapper(() =>
      dispatch(createQuiz({ quizData, token })).unwrap()
    );

    if (result.success) {
      setOpenAdd(false);
      toast.success("Quiz created successfully!");
      await dispatch(
        fetchQuizz({
          token,
          title: searchTerm,
          page,
          limit,
          session_id: sessionID
        })
      );
      setQuizPayload(quizData);
      form.reset();
      setRules([""]);
      setSelectedSubjects([]);
      setSelectedBatches([]);
      setComposition({});
      setSelectedCourseId(null);
    }
  };

  const onConfirmDelete = async (id) => {
    if (!id) return;

    await tryCatchWrapper(async () => {
      await dispatch(deleteQuiz({ id, token })).unwrap();
      showToast("Quiz deleted successfully", "success");
      await dispatch(
        fetchQuizz({
          token,
          title: searchTerm,
          page,
          limit,
          session_id: sessionID
        })
      );
    });
  };

  return (
    <div className="lg:ps-8 lg:pe-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full sm:max-w-xs border border-gray-300 placeholder-gray-500 bg-white"
        />
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpenAdd(true)}
              className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
            >
              <Plus size={18} />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Quiz
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Exam Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter exam name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium">Select Course</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCourseId(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          {course?.courses?.length > 0 ? (
                            course.courses.map((courseItem) => (
                              <SelectItem key={courseItem.id} value={String(courseItem.id)}>
                               <span className="truncate w-[400px]" title={courseItem.course_name}> {courseItem.course_name}</span>
                              </SelectItem>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-2">
                              No courses found
                            </p>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2 w-full">
                  <FormLabel className="font-medium">Select Subjects</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedSubjects.length > 0
                          ? `${selectedSubjects.length} Subject${selectedSubjects.length > 1 ? "s" : ""
                          } Selected`
                          : "Select Subjects"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full sm:w-[380px] max-w-[95vw] p-2" sideOffset={0} align="start">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {subject?.length > 0 ? (
                          subject.map((subjects) => (
                            <label key={subjects.id} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={selectedSubjects.includes(subjects.id)}
                                onCheckedChange={() => toggleSubject(subjects.id)}
                              />
                              <span className="truncate block max-w-full" title={subjects.subject_name}>
                                {subjects.subject_name}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-2">No subjects found</p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{form.formState.errors.subjects?.message}</FormMessage>
                </div>
                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} value={selectedSubjects} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-2 w-full">
                  <FormLabel className="font-medium">Select Batches</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedBatches.length > 0
                          ? `${selectedBatches.length} Batch${selectedBatches.length > 1 ? "es" : ""
                          } Selected`
                          : "Select Batches"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full sm:w-[380px] max-w-[95vw] p-2" sideOffset={0} align="start">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {batch?.length > 0 ? (
                          batch.map((batchItem) => (
                            <label key={batchItem?.id} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={selectedBatches.includes(batchItem?.id)}
                                onCheckedChange={() => toggleBatch(batchItem?.id)}
                              />
                              <span className="truncate block max-w-full" title={batchItem?.BatchesName}>
                                {batchItem?.BatchesName}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-2">No batches found</p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{form.formState.errors.batch?.message}</FormMessage>
                </div>
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => {
                    useEffect(() => {
                      form.setValue("batch", selectedBatches);
                    }, [selectedBatches]);
                    return <input type="hidden" {...field} />;
                  }}
                />
                {Object.keys(composition).length > 0 && (
                  <div className="border rounded-xl p-4 space-y-5 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                      Select Question Composition
                    </h2>
                    {Object.entries(composition).map(([subjectName, value]) => (
                      <div key={subjectName} className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="truncate w-[300px]" title={subjectName}>{subjectName}</span>
                          <span>{value}%</span>
                        </div>
                        <input
                          type="range"
                          value={value}
                          min={0}
                          max={100}
                          onChange={(e) => handleSliderChange(subjectName, Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    ))}
                    <FormMessage>{form.formState.errors.composition?.message}</FormMessage>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium">Schedule Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                          min={new Date().toISOString().slice(0, 16)}
                          {...field}
                          ref={dateRef}
                          onClick={() => dateRef.current?.showPicker?.()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="duration_hours"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="font-medium">Hours</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-3 py-2 bg-white text-black">
                              <option value="0">0 hr</option>
                              <option value="1">1 hr</option>
                              <option value="2">2 hr</option>
                              <option value="3">3 hr</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration_minutes"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="font-medium">Minutes</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-3 py-2 bg-white text-black">
                              <option value="0">0 min</option>
                              <option value="15">15 min</option>
                              <option value="30">30 min</option>
                              <option value="45">45 min</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="qust_num"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Number of question</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quest no"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Passing %</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Minimum passing % (e.g., 40)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rules"
                  render={() => (
                    <FormItem>
                      <FormLabel className="font-medium">Quiz Rules</FormLabel>
                      <div className="space-y-3">
                        {rules.map((rule, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              value={rule}
                              placeholder={`Rule ${index + 1}`}
                              onChange={(e) =>
                                handleRuleChange(index, e.target.value)
                              }
                            />
                            {rules.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeRule(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addRule} className="mt-2">
                          + Add Rule
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timePerQuestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Time Per Question (in seconds)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="E.g., 60" className="bg-gray-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md"
                >
                  Save Exam
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
          </div>
        </div>
      ) : paginatedData?.length === 0 ? (
        <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
          <No_data_found />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedData?.map((exam) => (
            <Card
              key={exam.id}
              className="flex flex-col justify-between w-full bg-white/95 dark:bg-gray-800/95 
                 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md 
                 hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white ">
                   <span className="truncate w-[200px] block" title={exam.title}> {exam.title}</span>
                  </CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex items-center gap-2 px-3 py-2 rounded-md 
                           bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash size={16} />
                        <span className="hidden md:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-900">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          This will permanently delete <b>{exam?.title}</b> and
                          remove its data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => onConfirmDelete(exam.id)}
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <p className="text-sm">
                  <span className="font-medium ">Course:</span>{" "}
                  <span className="truncate w-[260px] block" title={exam.course_name}> {exam.course_name}</span>
                </p>
                <div
                  className="h-24 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-800"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <p className="font-medium mb-1">Subjects:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {exam?.subject_names?.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))}
                  </ul>
                </div>
                <p className="flex items-center gap-2 text-sm">
                  <CalendarIcon size={16} className="text-blue-500" />
                  <span className="font-medium">Schedule:</span>{" "}
                  {exam.quizz_time}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <FileQuestionIcon size={16} className="text-blue-500" />
                  <span className="font-medium">Questions:</span>{" "}
                  {exam.total_question}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="w-full">
                  <Progress
                    value={exam.passing_percentage}
                    className="h-2 w-full bg-gray-200 dark:bg-gray-700 
                       [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                    Passing Percentage: {exam.passing_percentage}%
                  </span>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full text-white rounded-lg"
                  onClick={() => {
                    dispatch(get_quiz_by_id({ id: exam.id, token }));
                    setopen(true);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Sheet open={open} onOpenChange={setopen}>
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
                  {/* <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" /> */}
                  <div className="flex items-center">
                    <strong className="font-semibold text-gray-900 dark:text-gray-100 inline-block">
                      Course:
                    </strong>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 truncate inline-block" style={{ maxWidth: '200px' }} title={quiz?.data?.Course?.course_name}>
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
                {quiz?.data?.passing_percentage || "N/A"}%
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
              <p className="font-semibold mb-2">Batches:</p>
              {quiz?.data?.batch_Quizzs?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {quiz.data.batch_Quizzs.map((b) => (
                    <li key={b.id}>
                      {b.Batch?.BatchesName || "Unnamed Batch"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <p>
                <strong>Number of Questions:</strong>{" "}
                {quiz?.data?.total_question || "N/A"}
              </p>
            </div>
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
          </div>
        </SheetContent>
      </Sheet>
      <Pagination>
        <PaginationContent className="mt-6 justify-end">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage(Math.max(1, page - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ScheduledQuizzes;