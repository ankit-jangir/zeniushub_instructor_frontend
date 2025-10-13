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
import { fetchExamsByBatchId, saveExamResult } from "@/instructor/Redux/Api/Exam_api";
import { showToast } from "@/instructor/utils/ToastHandler";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { Calendar, FileText, Plus, Pencil, Save, Clock } from "lucide-react";
import { useEffect } from "react";
import { React, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


const ResultDeclare = ({ exam, fetchexamshistorydata }) => {
  const exams = exam;

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  const [batch, setBatch] = useState(null);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState({});
  const [savedStudents, setSavedStudents] = useState({});
  const [activeNoteStudent, setActiveNoteStudent] = useState(null); // For Note Dialog


  const dispatch = useDispatch();
  const { Exams, loadingE, loadingR } = useSelector((state) => state.exam);



  const handleSave = async () => {
    const results = studentData.map((student) => {
      const studentId = student.Student_Enrollment.student_id;

      return {
        id: student.id,
        marks_obtained: Number(marks[studentId]),
        note: notes[studentId],
      };
    });

    const payload = {
      examId: exams.exam_batch_id,
      results,
      token,
    };


    const result = await tryCatchWrapper(() =>
      dispatch(saveExamResult(payload)).unwrap()
    );

    if (result.success) {
      const successMessage = result.data?.message;
      showToast(successMessage, "success", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchexamshistorydata();
    }
  };



  const [marks, setMarks] = useState({});



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
          <Button className="bg-blue-600 hover:bg-blue-700 w-full px-10 text-white">
            Declare Result
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white dark:bg-gray-900 border-l border-gray-200/50 dark:border-gray-700/50 w-full max-w-md p-6 sm:p-8 overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/50 pb-4 flex items-center space-x-3">
              <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <span>Declare Result</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-6 text-gray-800 dark:text-gray-200">
            {/* Exam Name */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                Exam Name: {exams?.exam_name || "Exam Name"}
              </p>
            </div>

            {/* Course, Subject, Total Marks, Passing % */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Course:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {exams?.course_name || "N/A"}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Subject:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
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

            {/* Question Paper */}
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

            {/* Exam Schedule */}
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

            {/* Batch Names */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Batches name:
              </p>
              {/* {batches.map((b) => (
                <p
                  key={b.id}
                  onClick={() => handleOpen(b)}
                  className="cursor-pointer hover:underline text-blue-600"
                >
                  {b.name}
                </p>
              ))} */}
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
                className="w-full lg:max-w-[900px] md:max-w-4xl sm:max-w-[95vw] max-h-[85vh] overflow-y-auto scrollbar-hide p-6 rounded-2xl z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                style={{ backdropFilter: "none" }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Declare Result -{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {batch?.batch_name}
                    </span>
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow max-h-[50vh] overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 border-b">Student ID</th>
                        <th className="px-6 py-4 border-b">Name</th>
                        <th className="px-6 py-4 border-b">Marks</th>
                        <th className="px-6 py-4 border-b text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData?.map((student) => {
                        const studentId = student.Student_Enrollment.student_id;
                        const isSaved = savedStudents[studentId];
                        const mark = marks[studentId] ?? "";

                        return (
                          <tr
                            key={studentId}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-6 py-4">{studentId}</td>
                            <td className="px-6 py-4 truncate w-[200px] block" title={student.Student_Enrollment.Student.name}>
                              {student.Student_Enrollment.Student.name}
                            </td>
                            <td className="px-6 py-4">
                              {isSaved ? (
                                <span>{mark} / 100</span>
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    value={mark}
                                    onChange={(e) =>
                                      setMarks((prev) => ({
                                        ...prev,
                                        [studentId]: e.target.value,
                                      }))
                                    }
                                    placeholder="0"
                                    className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                                  />
                                  / 100
                                </>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {!isSaved ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-blue-600 dark:text-blue-400"
                                    onClick={() =>
                                      setActiveNoteStudent(studentId)
                                    }
                                  >
                                    <Plus /> Note
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-blue-600 dark:text-blue-400"
                                    onClick={() => {
                                      setSavedStudents((prev) => ({
                                        ...prev,
                                        [studentId]: true,
                                      }));
                                    }}
                                  >
                                    <Save /> Save
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2 text-blue-600 dark:text-blue-400"
                                  onClick={() =>
                                    setSavedStudents((prev) => ({
                                      ...prev,
                                      [studentId]: false,
                                    }))
                                  }
                                >
                                  <Pencil /> Edit
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog
              open={!!activeNoteStudent}
              onOpenChange={() => setActiveNoteStudent(null)}
            >
              <DialogOverlay className="fixed inset-0 z-50 bg-black/30" />
              <DialogContent className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                    Add Note for Student ID: {activeNoteStudent}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <textarea
                    rows={4}
                    className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:text-white resize-y"
                    placeholder="Write a note..."
                    value={notes[activeNoteStudent] ?? ""}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [activeNoteStudent]: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveNoteStudent(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Optional: toast("Note saved")
                      setActiveNoteStudent(null);
                    }}
                  >
                    Save Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6 rounded-xl shadow-lg text-lg font-semibold">
                  Publish Result
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-rendering-optimizeLegibility">
                <AlertDialogHeader>
                  <AlertDialogTitle>Publish Result</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Result once published cannot
                    be altered/reversed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave} disabled={loadingR}>  {loadingR ? "Saving..." : "Publish"}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ResultDeclare;
