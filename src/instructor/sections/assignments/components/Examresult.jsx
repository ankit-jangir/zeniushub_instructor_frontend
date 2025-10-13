import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, FileTextIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function ExamResultDetails({ exam, name, id, img }) {
  return (
    <div className="max-w-3xl  p-4 space-y-6">
      <Card className="shadow-xl rounded-3xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Exam Result Details</CardTitle>
            <CardDescription>{exam?.exam_batch?.Exam?.exam_name}</CardDescription>
          </div>
          {
            exam.status !== "not attempted" && (
              <div className="text-sm text-muted-foreground">Result Declared on <span className="text-blue-500">{exam?.exam_batch.Exam?.result_dec_date || exam?.result_dec_date}</span></div>
            )
          }
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={`${BASE_URL}/viewimagefromazure?filePath=${img}`}
              alt={name?.at(0)}
              className="rounded-full w-16 h-16 object-cover border border-gray-500"
            />
            <div>
              <h3 className="text-lg font-medium break-all">{name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Student ID : {id}</p>
              <Badge variant="outline" className="mt-1"><strong>Batch</strong> <span className="truncate w-[180px] sm:w-[400px]" title={exam?.exam_batch.Batch?.BatchesName}>{exam?.exam_batch.Batch?.BatchesName}</span></Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-medium">Course</p>
              <p className="text-muted-foreground">{exam?.exam_batch.Exam?.Course?.course_name}</p>
            </div>
            <div>
              <p className="font-medium">Subject</p>
              <p className="text-muted-foreground">{exam?.exam_batch.Exam?.Subject?.subject_name}</p>
            </div>
            <div>
              <p className="font-medium">Exam Date</p>
              <p className="text-muted-foreground flex items-center gap-2"><CalendarIcon className="w-4 h-4" />     {exam?.exam_batch.Exam?.schedule_date} -  {exam?.exam_batch.Exam?.start_time} to {exam?.exam_batch.Exam?.end_time}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
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
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-medium">Marks</p>
              <p>    {exam?.exam_batch.Exam?.total_marks}</p>
            </div>
            <div>
              <p className="font-medium">Student's Score</p>
              <p> {exam.marks_obtained || "--"}/{exam?.exam_batch.Exam?.total_marks}</p>
            </div>
            <div>
              <p className="font-medium">Passing Percentage</p>
              <p className="text-blue-600 font-semibold"> {exam?.exam_batch.Exam?.pass_percent}%</p>
            </div>
            <div>
              <p className="font-medium">Student's Percentage</p>
              <p className="text-green-600 font-semibold">{exam.student_percent || "--"}%</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-medium mb-1">Question Paper</p>
              <TooltipProvider>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button tabIndex={-1} variant="outline" className="justify-start truncate w-full">
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      {exam?.exam_batch.Exam?.ques_paper ? (
                        <a
                          href={`${BASE_URL}/viewimagefromazure?filePath=${exam?.exam_batch.Exam?.ques_paper}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline truncate w-[150px]"
                        >
                          {exam?.exam_batch.Exam?.ques_paper}
                        </a>
                      ) : (
                        "No attachment"
                      )}
                    </Button>

                  </TooltipTrigger>
                  <TooltipContent>
                    {exam?.exam_batch.Exam?.ques_paper ? exam?.exam_batch.Exam?.ques_paper : "No attachment"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-lg font-semibold mb-2">Instructor's Notes</h4>
            <p className="text-sm text-muted-foreground">
              {exam.note || "No note"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


