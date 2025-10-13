import React, { useMemo, useState, useEffect } from "react";
import {
  Calendar,
  CalendarIcon,
  Clock,
  ClockIcon,
  FileText,
  Eye,
  Search,
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
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "../../../assets/logo/image.png";
import { useSelector, useDispatch } from "react-redux";
import {
  addQuestion,
  fetchAllQuestions,
  fetchQuestionPapers,
  get_course,
  get_subject,
  uploadQuestionPaper,
} from "@/instructor/Redux/Api/Quiz_api";
import No_data_found from "@/instructor/common/no_data_found";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Quizz.css";
import { BookOpen } from "lucide-react";
import { Users } from "lucide-react";
import { Book } from "lucide-react";

// Zod schema for a single question
const questionSchema = z
  .object({
    question: z.string().optional(),
    questionText: z.string().optional(),
    questionImage: z.any().optional(),
    options: z
      .array(
        z.union([
          z.string().nonempty({ message: "Option text is required1" }),
          z.object({
            // text: z.string().nonempty({ message: "Option text is required" }),
            image: z
              .instanceof(FileList)
              .refine((fileList) => fileList?.length > 0, {
                message: "Image is required for this option2",
              }),
          }),
        ])
      )
      .length(4, { message: "Exactly 4 options are required" }),
    correctAnswer: z
      .string()
      .nonempty({ message: "Correct answer is required" }),
    isImage: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.isImage) {
      // Image-based question
      if (data.options.some((opt) => typeof opt === "string")) {
        ctx.addIssue({
          code: "custom",
          message: "All options must include images for image-based questions",
          path: ["options"],
        });
      }
      data.options.forEach((opt, i) => {
        if (typeof opt !== "object" || !opt.image || opt.image.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: `Image is required for option ${String.fromCharCode(
              65 + i
            )}`,
            path: [`options.${i}.image`],
          });
        }
      });
    } else {
      // Text-based question
      if (!data.question || data.question.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Question text is required for text-based questions",
          path: ["question"],
        });
      }
      if (data.options.some((opt) => typeof opt !== "string")) {
        ctx.addIssue({
          code: "custom",
          message: "All options must be text for text-based questions",
          path: ["options"],
        });
      }
    }
  });

const formSchema = z.object({
  course: z.string().nonempty({ message: "Course is required" }),
  subject: z.string().nonempty({ message: "Subject is required" }),
  questions: z
    .array(questionSchema)
    .min(1, { message: "At least one question is required" }),
  File: z.instanceof(FileList).optional(),
});

const formSchema1 = z.object({
  course: z.string().nonempty({ message: "Course is required" }),
  subject: z.string().nonempty({ message: "Subject is required" }),
  questions: z.array(z.any()).optional(),
  File: z.instanceof(FileList).refine((fileList) => fileList?.length > 0, {
    message: "Please upload an Excel file",
  }),
});

const QuestionBank = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const token =
    useSelector((state) => state.employee.token) ||
    localStorage.getItem("token");
  const [batch, setBatch] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const { data, loading, error, pagination } = useSelector(
    (s) => s.quizzSlice || {}
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quizzState = useSelector((state) => state.quizzSlice || {});
  const {
    questions = [],
    questionsLoading = false,
    questionsError = null,
    questionsPagination = {},
  } = quizzState;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentQuestionsPage, setCurrentQuestionsPage] = useState(1);
  const questionsLimit = 10;

  const handleViewDetails = (course_id, subject_id) => {
    setSelectedCourseId(course_id);
    setSelectedSubjectId(subject_id);
    setCurrentQuestionsPage(1);
    setSearchTerm("");
    setIsSheetOpen(true);
  };

  useEffect(() => {
    if (isSheetOpen && selectedCourseId && selectedSubjectId && token) {
      dispatch(
        fetchAllQuestions({
          token,
          course_id: selectedCourseId,
          subject_id: selectedSubjectId,
          page: currentQuestionsPage,
          limit: questionsLimit,
          search: searchTerm,
        })
      );
    }
  }, [
    isSheetOpen,
    selectedCourseId,
    selectedSubjectId,
    currentQuestionsPage,
    searchTerm,
    dispatch,
    token,
  ]);

  const handleOpenChange = (open) => {
    setIsSheetOpen(open);
    if (!open) {
      setSearchTerm("");
      setCurrentQuestionsPage(1);
      setSelectedCourseId(null);
      setSelectedSubjectId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentQuestionsPage(1);
  };

  const handleQuestionsPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (questionsPagination.totalPages || 1)) {
      setCurrentQuestionsPage(newPage);
    }
  };

  const courses = useSelector((s) => {
    const courseData = s.quizzSlice.course?.courses || [];
    return Array.isArray(courseData) ? courseData : [];
  });
  const subjects = useSelector((s) => {
    const subjectData = s.quizzSlice.subject || [];
    return Array.isArray(subjectData) ? subjectData : [];
  });

  const handleOpen = (b) => {
    setBatch(b);
    setOpen(true);
  };

  const studentData = useMemo(() => {
    return batch?.students?.map((bStudent) => ({
      ...bStudent,
      details: students?.find(
        (s) => s.name.toLowerCase() === bStudent.name.toLowerCase()
      ),
    }));
  }, [batch]);

  const [page, setPage] = useState(1);
  const Examperpage = 12;

  const paginatedData = Array.isArray(data?.data) ? data.data : [];
  const totalItems = pagination?.totalItems || 0;
  const totalPages = pagination?.totalPages || 1;

  const currentData = paginatedData;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      dispatch(
        fetchQuestionPapers({ token, page: newPage, limit: Examperpage })
      );
    }
  };

  const getVisiblePages = (page, totalPages) => {
    const delta = 2;
    const pages = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      pages.push(i);
    }

    if (page - delta > 2) {
      pages.unshift("...");
    }
    if (page + delta < totalPages - 1) {
      pages.push("...");
    }

    pages.unshift(1);
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (token) {
        try {
          await dispatch(get_course(token)).unwrap();
        } catch (err) {
          console.error("Error fetching courses:", err);
          toast.error("Failed to fetch courses");
        }
      }
    };
    fetchCourses();
  }, [dispatch, token]);

  useEffect(() => {
    const fetchPapers = async () => {
      if (token) {
        try {
          await dispatch(
            fetchQuestionPapers({ token, page: 1, limit: Examperpage })
          ).unwrap();
        } catch (err) {
          console.error("Error fetching question papers:", err);
          toast.error("Failed to fetch question papers");
        }
      }
    };
    fetchPapers();
  }, [dispatch, token]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCourseId && token) {
        setValue("subject", "");
        try {
          await dispatch(get_subject({ token, id: selectedCourseId })).unwrap();
        } catch (err) {
          console.error("Error fetching subjects:", err);
          toast.error("Failed to fetch subjects");
        }
      }
    };
    fetchData();
  }, [selectedCourseId, dispatch, token]);

  const {
    register: registerManual,
    control: controlManual,
    handleSubmit: handleManualSubmit,
    setValue,
    reset: resetManual,
    formState: { errors: manualErrors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: "",
      subject: "",
      questions: [],
    },
    mode: "onChange",
  });

  const {
    register: registerExcel,
    handleSubmit: handleExcelSubmit,
    setValue: setValueExcel,
    reset: resetExcel,
    formState: { errors: excelErrors },
  } = useForm({
    resolver: zodResolver(formSchema1),
    defaultValues: {
      course: "",
      subject: "",
      File: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: controlManual,
    name: "questions",
  });

  useEffect(() => {
    if (dialogOpen) {
      resetManual({
        course: "",
        subject: "",
        questions: [],
      });
      resetExcel({
        course: "",
        subject: "",
        File: undefined,
      });
      setSelectedCourseId(null);
      setSelectedSubjectId(null);
    }
  }, [dialogOpen, resetManual, resetExcel]);

  const onManualSubmit = async (data) => {
    const { course, subject, questions } = data;

    try {
      for (const question of questions) {
        const questionData = {
          course_id: course,
          subject_id: subject,
          question: question.isImage
            ? question.questionText || ""
            : question.question,
          option1: question.isImage
            ? question.options[0].text || ""
            : question.options[0],
          option2: question.isImage
            ? question.options[1].text || ""
            : question.options[1],
          option3: question.isImage
            ? question.options[2].text || ""
            : question.options[2],
          option4: question.isImage
            ? question.options[3].text || ""
            : question.options[3],
          answer: question.correctAnswer,
          file:
            question.isImage && question.questionImage?.[0]
              ? question.questionImage[0]
              : null,
          // Include option images if isImage is true
          option1_image:
            question.isImage && question.options[0].image?.[0]
              ? question.options[0].image[0]
              : null,
          option2_image:
            question.isImage && question.options[1].image?.[0]
              ? question.options[1].image[0]
              : null,
          option3_image:
            question.isImage && question.options[2].image?.[0]
              ? question.options[2].image[0]
              : null,
          option4_image:
            question.isImage && question.options[3].image?.[0]
              ? question.options[3].image[0]
              : null,
        };

        await dispatch(addQuestion({ token, questionData })).unwrap();
        toast.success(
          `Question ${
            questionData.question || "Image-based"
          } added successfully!`
        );
      }

      toast.success("All questions added successfully!");
      setDialogOpen(false);
      dispatch(fetchQuestionPapers({ token, page, limit: Examperpage }));
      resetManual({
        course: "",
        subject: "",
        questions: [],
      });
      setSelectedCourseId(null);
      setSelectedSubjectId(null);
    } catch (err) {
      console.error("Error in onManualSubmit:", err);
      toast.error(err.message || "Failed to add questions");
    }
  };

  const onExcelSubmit = async (data) => {
    const file = data.File?.[0];
    if (!file || !(file instanceof File)) {
      toast.error("Please select a valid Excel file");
      return;
    }
    try {
      await dispatch(
        uploadQuestionPaper({
          token,
          course_id: data.course,
          subject_id: data.subject,
          file,
        })
      ).unwrap();
      toast.success("Question paper uploaded successfully!");
      setDialogOpen(false);
      dispatch(fetchQuestionPapers({ token, page, limit: Examperpage }));
      resetExcel({
        course: "",
        subject: "",
        File: undefined,
      });
      setSelectedCourseId(null);
      setSelectedSubjectId(null);
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err.message || "Failed to upload question paper"
      );
    }
  };

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.error?.length > 0
      ? error.error[0]?.message
      : error?.message || "Something went wrong. Please try again.";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Exam List
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              + Add Question Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                Add Question Paper
              </DialogTitle>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Select Course
                  </Label>
                  <Select
                    onValueChange={(val) => {
                      if (activeTab === "manual") {
                        setValue("course", val, {
                          shouldValidate: true,
                          shouldTouch: true,
                        });
                        setSelectedCourseId(val);
                      } else {
                        setValueExcel("course", val);
                        setSelectedCourseId(val);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700">
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <p>No courses available</p>
                      ) : (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.course_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {activeTab === "manual" && manualErrors.course && (
                    <p className="text-sm text-red-500 mt-1">
                      {manualErrors.course.message}
                    </p>
                  )}
                  {activeTab === "excel" && excelErrors.course && (
                    <p className="text-sm text-red-500 mt-1">
                      {excelErrors.course.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Select Subject
                  </Label>
                  <Select
                    onValueChange={(val) => {
                      if (activeTab === "manual") {
                        setValue("subject", val, {
                          shouldValidate: true,
                          shouldTouch: true,
                        });
                      } else {
                        setValueExcel("subject", val);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.length === 0 ? (
                        <p>No subjects available</p>
                      ) : (
                        subjects.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={String(subject.id)}
                          >
                            {subject.subject_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {activeTab === "manual" && manualErrors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {manualErrors.subject.message}
                    </p>
                  )}
                  {activeTab === "excel" && excelErrors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {excelErrors.subject.message}
                    </p>
                  )}
                </div>
              </div>
            </DialogHeader>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="excel">Upload via Excel</TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <form
                  onSubmit={handleManualSubmit(onManualSubmit)}
                  className="space-y-6"
                >
                  {fields.map((field, qIndex) => (
                    <div
                      key={field.id}
                      className="relative border border-gray-300 dark:border-gray-700 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-4"
                    >
                      <button
                        type="button"
                        onClick={() => remove(qIndex)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                      >
                        ✖
                      </button>
                      <Label className="font-medium text-base">
                        Question {qIndex + 1} (
                        {field.isImage ? "Image" : "Text"})
                      </Label>
                      {field.isImage ? (
                        <>
                          <Input
                            {...registerManual(
                              `questions.${qIndex}.questionText`
                            )}
                            placeholder="Enter question text (optional)"
                          />
                          <Input
                            type="file"
                            accept="image/*"
                            {...registerManual(
                              `questions.${qIndex}.questionImage`
                            )}
                          />
                          {manualErrors.questions?.[qIndex]?.questionImage && (
                            <p className="text-sm text-red-500 mt-1">
                              {
                                manualErrors.questions[qIndex].questionImage
                                  ?.message
                              }
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <Input
                            {...registerManual(`questions.${qIndex}.question`)}
                            placeholder="Enter question"
                          />
                          {manualErrors.questions?.[qIndex]?.question && (
                            <p className="text-sm text-red-500 mt-1">
                              {manualErrors.questions[qIndex].question?.message}
                            </p>
                          )}
                        </>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["A", "B", "C", "D"].map((label, optIndex) => (
                          <div key={label} className="space-y-2">
                            <Label>Option {label}</Label>
                            {field.isImage ? (
                              <>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  {...registerManual(
                                    `questions.${qIndex}.options.${optIndex}.image`
                                  )}
                                />
                                {manualErrors.questions?.[qIndex]?.options?.[
                                  optIndex
                                ]?.image && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      manualErrors.questions[qIndex].options[
                                        optIndex
                                      ].image?.message
                                    }
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                <Input
                                  {...registerManual(
                                    `questions.${qIndex}.options.${optIndex}`
                                  )}
                                  placeholder={`Option ${label}`}
                                />
                                {manualErrors.questions?.[qIndex]?.options?.[
                                  optIndex
                                ] && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      manualErrors.questions[qIndex].options[
                                        optIndex
                                      ]?.message
                                    }
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                        {manualErrors.questions?.[qIndex]?.options?.message && (
                          <div className="col-span-full">
                            <p className="text-sm text-red-500 mt-1">
                              {manualErrors.questions[qIndex].options.message}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Correct Answer</Label>
                        <select
                          {...registerManual(
                            `questions.${qIndex}.correctAnswer`
                          )}
                          className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <option value="">Select correct option</option>
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                        {manualErrors.questions?.[qIndex]?.correctAnswer && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              manualErrors.questions[qIndex].correctAnswer
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 text-blue-600 border-blue-500 hover:bg-blue-50"
                      onClick={() =>
                        append({
                          isImage: false,
                          question: "",
                          options: ["", "", "", ""],
                          correctAnswer: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4" />
                      Add Text Question
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 text-green-600 border-green-500 hover:bg-green-50"
                      onClick={() =>
                        append({
                          isImage: true,
                          questionText: "",
                          questionImage: null,
                          options: [
                            { image: null },
                            { image: null },
                            { image: null },
                            { image: null },
                          ],
                          correctAnswer: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4" />
                      Add Image Question
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Question Paper
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="excel">
                <form
                  onSubmit={handleExcelSubmit(onExcelSubmit)}
                  className="space-y-4"
                >
                  <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Upload an Excel file with your questions and options.
                    </p>
                    <Input
                      type="file"
                      accept=".xlsx, .xls"
                      {...registerExcel("File")}
                      className="mt-4"
                    />
                    {excelErrors.File && (
                      <p className="text-sm text-red-500 mt-1">
                        {excelErrors.File.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload & Import"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      {loading && !dialogOpen ? (
        <div className="h-screen flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      ) : currentData.length === 0 ? (
        <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
          <No_data_found />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.map((exam, index) => (
            <Card
              key={exam.id || index}
              className="w-full bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-md dark:shadow-blue-500/50 p-0"
            >
              <CardHeader className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 h-[100px] w-full rounded-t-xl p-4">
                <Book className="mr-2 h-4 w-4" />
                <div className="flex items-center">
                  <strong className="font-semibold text-gray-900 dark:text-gray-100 inline-block">
                    Subject:
                  </strong>
                  <span
                    className="ml-2 text-gray-700 dark:text-gray-200 truncate inline-block"
                    style={{ maxWidth: "170px" }}
                    title={exam.subject_name || "N/A"}
                  >
                    {exam.subject_name || "N/A"}
                  </span>
                </div>
              </CardHeader>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 space-y-2 p-0">
                <div className="bg-white dark:bg-gray-800 min-h-[120px] mt-5 ml-5">
                  <p className="text-sm font-medium mb-2 flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="mr-2 h-4 w-4" />
                    Batches:
                  </p>
                  <ul className="max-h-24 overflow-y-auto list-disc list-inside ml-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {Array.isArray(exam.batches) && exam.batches.length > 0 ? (
                      exam.batches.map((batch, idx) => (
                        <li
                          className="truncate w-[150px]"
                          key={idx}
                          title={batch}
                        >
                          {batch}
                        </li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 min-h-[120px] ml-5">
                  <p className="text-sm font-medium mb-2 flex items-center text-gray-600 dark:text-gray-300">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Courses:
                  </p>
                  <ul className="max-h-24 overflow-y-auto list-disc list-inside ml-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {Array.isArray(exam.course_name) &&
                    exam.course_name.length > 0 ? (
                      exam.course_name.map((course, index) => (
                        <li
                          className="truncate w-[170px]"
                          key={index}
                          title={course}
                        >
                          {course}
                        </li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>
              </CardDescription>
              <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mt-auto p-0">
                <CardTitle className="text-xl font-semibold">
                  <span className="text-gray-700 dark:text-gray-300 ml-5">
                    # Total Questions{" "}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 ml-20">
                    {exam.course_question_count || "N/A"}
                  </span>
                </CardTitle>
              </CardContent>
              <CardFooter className="mt-auto p-0">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full rounded-full px-12 text-white"
                  onClick={() =>
                    handleViewDetails(exam.course_id, exam.subject_Id)
                  }
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
      <Pagination>
        <PaginationContent className="mt-6 justify-end">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {getVisiblePages(page, totalPages).map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <span className="px-4 py-2">...</span>
              ) : (
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(p)}
                  className={`px-4 py-2 rounded-md ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(page + 1)}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="bg-white dark:bg-gray-900 border-l w-full max-w-md p-6 overflow-y-auto scrollbar-thin">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-4 flex items-center space-x-3">
              <FileText className="w-7 h-7 text-blue-600" />
              <span>Question Paper Details</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex items-center border border-blue-300 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 w-full max-w-md shadow-md">
            <Search size={18} className="text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search by Question Name..."
              className="ml-2 w-full outline-none bg-transparent text-sm text-gray-800 dark:text-gray-100"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="mt-8 space-y-6 text-gray-800 dark:text-gray-200">
            <div className="space-y-4">
              {questionsLoading ? (
                <p>Loading questions...</p>
              ) : questionsError ? (
                <p>Error: {questionsError}</p>
              ) : questions.length > 0 ? (
                questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="border rounded-lg p-4 space-y-2 bg-white dark:bg-[#1e2939]"
                  >
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Q{idx + 1}: {q.question}
                    </p>
                    <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-gray-300">
                      <p>
                        <strong className="text-gray-700 dark:text-gray-200 mr-1">
                          (a)
                        </strong>
                        {q.option1}
                      </p>
                      <p>
                        <strong className="text-gray-700 dark:text-gray-200 mr-1">
                          (b)
                        </strong>
                        {q.option2}
                      </p>
                      <p>
                        <strong className="text-gray-700 dark:text-gray-200 mr-1">
                          (c)
                        </strong>
                        {q.option3}
                      </p>
                      <p>
                        <strong className="text-gray-700 dark:text-gray-200 mr-1">
                          (d)
                        </strong>
                        {q.option4}
                      </p>
                    </ul>
                    <p className="text-gray-800 dark:text-gray-200">
                      <strong>Answer:</strong> {q.answer || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No questions available</p>
              )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogOverlay className="fixed inset-0 z-40 bg-black/20 transition-all duration-300" />
              <DialogContent className="w-full lg:max-w-[900px] md:max-w-4xl sm:max-w-[95vw] max-h-[85vh] overflow-y-auto p-6 rounded-2xl z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-rendering-optimizeLegibility">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Declared Result -{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {batch?.name}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
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
                          <td className="px-6 py-4">{student.id}</td>
                          <td className="px-6 py-4">{student.name}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                student.details?.status === "pass"
                                  ? "text-green-700 border-green-500 bg-green-50 dark:bg-green-900/30 dark:text-green-300"
                                  : "text-red-600 border-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {student.details?.status?.toUpperCase() ?? "N/A"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {student.details?.marks ?? "-"} / 50
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-blue-600 dark:text-blue-400"
                              onClick={() => navigate("/Studentprofile")}
                            >
                              <Eye className="h-4 w-4" />
                              Complete Result
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
            <Pagination>
              <PaginationContent className="mt-6 justify-end">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      handleQuestionsPageChange(currentQuestionsPage - 1)
                    }
                    className={
                      currentQuestionsPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {getVisiblePages(
                  currentQuestionsPage,
                  questionsPagination.totalPages || 1
                ).map((p, index) => (
                  <PaginationItem key={index}>
                    {p === "..." ? (
                      <span className="px-4 py-2">...</span>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={() => handleQuestionsPageChange(p)}
                        className={`px-4 py-2 rounded-md ${
                          currentQuestionsPage === p
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      handleQuestionsPageChange(currentQuestionsPage + 1)
                    }
                    className={
                      currentQuestionsPage ===
                      (questionsPagination.totalPages || 1)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default QuestionBank;