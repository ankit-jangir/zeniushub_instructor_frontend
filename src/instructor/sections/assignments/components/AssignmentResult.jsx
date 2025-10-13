import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/instructor/utils/ToastHandler";
import { useDispatch, useSelector } from "react-redux";
import { declareResults, fetchBatchByAssignmentId, getResultByBatchAssignmentId } from "@/instructor/Redux/Api/Assignments_api";
import NoDataFound from "@/instructor/common/NoDataFound";
import Loading from "@/instructor/common/Loading";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputResultAssignmentsSchema } from "@/instructor/zod_validations/assignment";

export default function App({ activeTab, setActiveTab, onStudentClick, isDeclaredView, is_declare, assignmentId, parentClose, getAssignmentsUpcoming, getAssignmentsHistory }) {
  const { results, loadingResult, loadingDeclare, batches, loadingBatch } = useSelector((state) => state.assignments);
  const [students, setStudents] = useState([]);
  const [openPublish, setOpenPublish] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBatchResultDec, setSelectedBatchResultDec] = useState(false);

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);

  const schema = inputResultAssignmentsSchema(batches[0]?.Assignment?.total_marks);

  const {
    register,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { students: [] },
    mode: "onChange",
  });




  useEffect(() => {
    if (results && results.length > 0) {
      const updatedStudents = results.map((s) => ({
        ...s,
        isEditing: s.obtained_marks == null,
        obtained_marks: s.obtained_marks !== null &&
          s.obtained_marks !== undefined
          ? String(s.obtained_marks)
          : s.obtained_marks,
        note: s.note,
      }));
      setStudents(updatedStudents);

      setValue("students", updatedStudents);
    } else {
      setStudents([]);
      setValue("students", []);
    }
  }, [results]);


  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  const toggleEdit = (index) => {
    const updated = [...students];
    updated[index].isEditing = !updated[index].isEditing;
    setStudents(updated);
  };

  const handleMarksChange = (index, value) => {
    const updated = [...students];
    updated[index].obtained_marks = value;
    setStudents(updated);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...students];
    updated[index].note = value;
    setStudents(updated);
  };




  const handleDeclare = async () => {

    const updatedResultSheet = students.map((student) => ({
      id: student.id,
      obtained_marks: student.obtained_marks,
      note: student.note,
    }));

    const result = await tryCatchWrapper(() => dispatch(declareResults({ updatedResultSheet, token })).unwrap());

    if (result.success) {
      const successMessage = result.data?.message;
      setOpenPublish(false);
      parentClose()
      getAssignmentsUpcoming()
      getAssignmentsHistory()
      setActiveTab("details")
      showToast(successMessage, "success", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getStudentByBatchAssignmentId = async (batchAssignmentId, batchName, result_dec) => {
    if (batchAssignmentId) {
      await tryCatchWrapper(() => {
        dispatch(getResultByBatchAssignmentId({ batchAssignmentId, token })).unwrap()
      });
      if (batchName) {

        setSelectedBatch(batchName);
        console.log(batchName, "only batchName");
      }
      setStudents([])
      setSelectedBatchResultDec(result_dec);
      console.log(selectedBatch, "selectedBatch");

    }
  };



  const getBatchesByAssignmentId = async () => {
    if (assignmentId) {
      await tryCatchWrapper(() => dispatch(fetchBatchByAssignmentId({ assignmentId, token })).unwrap());
    }
  };

  useEffect(() => {
    getBatchesByAssignmentId();
  }, [assignmentId]);

  return (
    <Card className="rounded-2xl shadow-xl w-full">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0 mb-6">
          <h2 className="text-2xl font-bold">{is_declare ? "Exam Report" : "Declare Result"}</h2>
          {is_declare ? (
            activeTab === "details" ? null : (
              <Badge className="bg-blue-100 text-blue-700 text-xs font-medium">
                Result Declared on {results[0]?.result_declare_date}
              </Badge>
            )

          ) : (
            <>
              {activeTab === "details" ? null : (
                <Button variant="blueHover" onClick={() => setOpenPublish(true)} size="sm">
                  Publish Result
                </Button>
              )}
              <Dialog open={openPublish} onOpenChange={setOpenPublish}>
                <DialogContent
                  className="rounded-2xl shadow-2xl"
                  style={{ width: "460px" }}
                  onInteractOutside={(e) => e.preventDefault()}
                >
                  <DialogHeader className="flex flex-col items-center text-center gap-2">
                    <AlertTriangle className="text-yellow-500 w-10 h-10" />
                    <DialogTitle className="text-xl font-bold">
                      Publish Result of "<span >{batches[0]?.Assignment?.title}</span>" for "
                      <span
                        className="truncate w-[320px] inline-block align-bottom"
                        title={selectedBatch}
                      >
                        {selectedBatch}
                      </span>
                      "?
                    </DialogTitle>

                    <p className="text-sm text-muted-foreground">
                      Once published, the result cannot be altered or reversed.
                    </p>
                  </DialogHeader>
                  <DialogFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setOpenPublish(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 dark:text-white"
                      onClick={async () => {
                        const isValid = await trigger();
                        if (isValid) {
                          handleDeclare();
                        }
                        else {

                          showToast("Please correct the validation errors before publishing.", "error");
                        }
                      }}
                      disabled={loadingDeclare}
                    >
                      {loadingDeclare ? "Declaring..." : "Publish"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            if (val === "result" && !selectedBatch) {
              showToast("Please select a batch before viewing results.", "info");
              return;
            }
            setActiveTab(val);
          }}
          className="w-full"
        >
          <TabsList className="mb-4 bg-muted w-fit">
            <TabsTrigger value="details">Details</TabsTrigger>
            {activeTab === "details" ? null : (
              <TabsTrigger value="result">Result</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details">
            {
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{batches[0]?.Assignment?.title}</h3>
                  <p className="text-muted-foreground">
                    <strong>Course</strong>:{" "}
                    <span
                      className="font-medium truncate w-[280px] inline-block align-bottom"
                      title={batches[0]?.Assignment?.Course?.course_name}
                    >
                      {batches[0]?.Assignment?.Course?.course_name}
                    </span>
                  </p>

                  <p className="text-muted-foreground">
                    <strong>Subject</strong>:{" "}   <span
                      className="font-medium truncate w-[280px] inline-block align-bottom"
                      title={batches[0]?.Assignment?.Subject?.subject_name}
                    >
                      {batches[0]?.Assignment?.Subject?.subject_name}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Total Marks: <span className="font-medium">{batches[0]?.Assignment?.total_marks}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Uploaded File</h4>
                  <div className="mt-1 bg-muted px-3 py-2 rounded-md text-sm">
                    {batches[0]?.Assignment?.attachments ? (
                      <a
                        href={`${BASE_URL}/viewimagefromazure?filePath=${batches[0]?.Assignment?.attachments}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline truncate w-[300px] block"
                        title={batches[0]?.Assignment?.attachments}
                      >
                        {batches[0]?.Assignment?.attachments}
                      </a>
                    ) : (
                      "No attachment"
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Due Date
                  </label>
                  <div className="mt-1 bg-muted px-3 py-2 rounded-md text-sm">
                    {batches[0]?.Assignment?.due_date}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Batches</h4>

                  <ul className={`list-disc pl-5 mt-1 text-sm grid grid-cols-1 gap-y-1 ${batches.length < 4 ? null : "h-32"} overflow-y-auto scrollbar-hide pr-2`}>
                    {batches?.map((batch, i) => (
                      <li
                        onClick={() => {
                          getStudentByBatchAssignmentId(batch.id, batch?.Batch?.BatchesName, batch?.result_dec).then(() => {
                            setActiveTab("result");

                          });
                        }}

                        key={i}
                        className="w-full cursor-pointer text-blue-600 m-0 mt-3 p-0"
                      >
                        <div className="flex justify-between items-center">
                          <div className="truncate w-[180px] hover:underline" title={batch?.Batch?.BatchesName}>
                            {batch?.Batch?.BatchesName}
                          </div>

                          {batch.result_dec ? (
                            <span className="ml-2 text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">
                              Declared
                            </span>
                          ) : (
                            <span className="ml-2 text-red-600 text-xs bg-red-100 px-2 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            }
          </TabsContent>

          <TabsContent value="result">
            {(selectedBatchResultDec || isDeclaredView) ? (
              <div className="text-sm overflow-y-scroll h-[400px] overflow-x-auto scrollbar-hide w-[370px] md:w-full">
                <table className="min-w-full text-left border border-gray-200">
                  <thead className="bg-gray-100 dark:bg-[#3f3f3f] sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border">Student ID</th>
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Result Status</th>
                      <th className="px-4 py-2 border">Marks</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results?.map((student, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 border">{student.Student_Enrollment.student_id}</td>
                        <td className="px-4 py-2 border max-w-[200px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate w-[150px] block">{student?.Student_Enrollment?.Student?.name}</span>
                              </TooltipTrigger>
                              <TooltipContent>{student?.Student_Enrollment?.Student?.name}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-4 py-2 border">{student.status}</td>
                        <td className="px-4 py-2 border">{student.obtained_marks}</td>
                        <td
                          className="px-4 py-2 border text-blue-600 cursor-pointer hover:underline"
                          onClick={() => onStudentClick(student)}
                        >
                          View Details
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm overflow-y-scroll scrollbar-hide h-[400px] overflow-x-auto w-[370px] md:w-full">
                <table className="min-w-full text-left border border-gray-200">
                  <thead className="bg-gray-100 dark:bg-[#3f3f3f] sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border">Student ID</th>
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Marks</th>
                      <th className="px-4 py-2 border">Note</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students?.map((student, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{student.Student_Enrollment.student_id}</td>
                        <td className="px-4 py-2 border max-w-[200px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate w-[150px] block">{student?.Student_Enrollment?.Student?.name}</span>
                              </TooltipTrigger>
                              <TooltipContent>{student?.Student_Enrollment?.Student?.name}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-4 py-2 border">
                          {student.isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={student.obtained_marks}
                                {...register(`students.${index}.obtained_marks`)}
                                onChange={(e) => {
                                  handleMarksChange(index, e.target.value)
                                  setValue(`students.${index}.obtained_marks`, e.target.value);
                                  trigger(`students.${index}.obtained_marks`);
                                }}
                                className="w-20 h-8 px-3 py-1 text-sm border shadow-sm rounded-md"
                                placeholder="0"
                              />
                              {errors?.students?.[index]?.obtained_marks && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.students[index].obtained_marks.message}
                                </p>
                              )}
                              <span className="text-gray-600 dark:text-gray-400">
                                / {batches[0]?.Assignment?.total_marks}
                              </span>
                            </div>
                          ) : (
                            <span>
                              {student.obtained_marks} / {batches[0]?.Assignment?.total_marks}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 border">
                          {student.isEditing ? (
                            <>
                              <Textarea
                                placeholder="Write a note..."
                                value={student.note}

                                {...register(`students.${index}.note`)}
                                onChange={(e) => {
                                  handleNoteChange(index, e.target.value)
                                  setValue(`students.${index}.note`, e.target.value);
                                  trigger(`students.${index}.note`);
                                }}
                                className="shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 w-32 h-8 px-3 py-1 text-sm resize-none overflow-y-auto whitespace-normal break-words"
                              />
                              {errors?.students?.[index]?.note && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.students[index].note.message}
                                </p>
                              )}</>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="block w-32 h-8 px-3 py-1 text-sm border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto whitespace-normal break-words"
                                  >
                                    {student.note || "No note"}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>{student.note || "No note"}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </td>
                        <td className="px-4 py-2 border">

                          {student.isEditing ? (
                            <Button
                              className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                              size="sm"
                              onClick={() => toggleEdit(index)}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => toggleEdit(index)}>
                              Edit
                            </Button>
                          )}

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}



//   zod validations in fe & be add api,  exam details and aage ke dialogs,  tool tip in add, calender open 