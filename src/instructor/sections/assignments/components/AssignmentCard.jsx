import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"
import App from './AssignmentResult'
import StudentResult from './AssignmentReport'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const AssignmentCard = ({ title, Course, Subject, due_date, total_marks, min_percentage, is_result_dec, id, getAssignmentsUpcoming, getAssignmentsHistory, result_dec_percentage }) => {

  const [open, setOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isDeclaredView, setIsDeclaredView] = useState(false);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsDeclaredView(true);
    setOpen(false);
    setTimeout(() => setChildOpen(true), 100);
  };






  return (
    <div className="dark:border-[1] dark:bg-[#1f29377c] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="truncate w-[220px] block">
              {title}
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-gray-800 dark:bg-white dark:text-gray-800 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">{title}</h3>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
        <strong>Course:</strong>{" "}
        <span
          className="truncate w-[190px] inline-block align-bottom"
          title={Course.course_name}
        >
          {Course.course_name}
        </span>
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Subject</strong>: {"  "} <span
        className="truncate w-[190px] inline-block align-bottom"
        title={Subject.subject_name}
      >
        {Subject.subject_name}
      </span></p>
      <div className="flex items-center mt-2 text-gray-600 dark:text-gray-500">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{due_date}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-500 mt-2">Total Marks: {total_marks}</p>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-500">Passing Percentage</span>
          <span className="text-sm font-medium text-blue-600">{min_percentage}%</span>
        </div>
        {/* <Progress value={min_percentage} className="h-2.5 bg-blue-100 [&>div]:bg-blue-600" /> */}
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-500">Declare Percentage</span>
          <span className={`text-sm font-medium ${result_dec_percentage[id] < 35
            ? 'text-red-600'
            : result_dec_percentage[id] < 75
              ? 'text-yellow-600'
              : result_dec_percentage[id] === 100
                ? 'text-green-600'
                : 'text-blue-600'
            }`}>{result_dec_percentage[id]}%</span>
        </div>

        <Progress
          value={result_dec_percentage[id]}
          className={`h-2.5 bg-blue-100 ${result_dec_percentage[id] < 35
            ? '[&>div]:bg-red-500'
            : result_dec_percentage[id] < 75
              ? '[&>div]:bg-yellow-400'
              : result_dec_percentage[id] === 100
                ? '[&>div]:bg-green-600'
                : '[&>div]:bg-blue-600'
            }`}
        />
      </div>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={is_result_dec ? "blueHover" : "blueOutline"} className="mt-4 w-full">{is_result_dec ? "Result Declared" : "Result"}</Button>
        </DialogTrigger>
        <DialogContent
          // key={activeTab}

          onInteractOutside={(e) => e.preventDefault()}
          className="rounded-2xl shadow-2xl  w-full bg-white dark:bg-[#1f2937] p-0 border"
          style={{

            maxWidth: activeTab === "result" ? "54rem" : "64rem !importent",
            width: "100%",
            height: "auto", maxHeight: "none"
          }}
        >

          <App
            activeTab={activeTab}
            is_declare={is_result_dec}
            setActiveTab={setActiveTab}
            parentClose={() => setOpen(false)}
            onStudentClick={handleStudentClick}
            isDeclaredView={isDeclaredView}
            assignmentId={id}
            getAssignmentsUpcoming={getAssignmentsUpcoming}
            getAssignmentsHistory={getAssignmentsHistory}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={childOpen} onOpenChange={setChildOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="rounded-2xl shadow-2xl p-0 bg-white dark:bg-[#1f2937] scrollbar-hide overflow-y-auto z-[60]"
          style={{
            maxWidth: "860px",
            width: "100%",
            maxHeight: "86vh",
          }}
        >
          {selectedStudent && (
            <StudentResult
              title={title}
              student={selectedStudent}
              onBack={() => {
                setChildOpen(false);
                setTimeout(() => {
                  setOpen(true)
                  setActiveTab("result");
                  setIsDeclaredView(true);
                }, 100);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AssignmentCard
