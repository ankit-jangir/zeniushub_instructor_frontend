import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, ClockIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function QuizResultDetails({ setOpen, name, id, img, quiz }) {

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <Card className="  shadow-xl rounded-2xl border p-6">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-semibold">Quiz Result Details</h2>
        {
          quiz.status === "attempted" && (
            <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Result Declared on   {quiz?.batch_Quizz.quizz?.result_date || "yyyy/mm/dd"}
            </div>
          )
        }
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Avatar className="h-16 w-16 border border-gray-400">
          <AvatarImage className="h-full w-full" src={`${BASE_URL}/viewimagefromazure?filePath=${img}`} />
          <AvatarFallback>{name?.at(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium break-all">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">Student ID: {id}</p>
          <Button onClick={() => setOpen(false)} variant="link" className="p-0 h-auto text-xs text-blue-600">
            View Profile
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <p className="font-medium text-gray-700 dark:text-gray-500">
          {quiz?.batch_Quizz.quizz?.title}
        </p>
        <Badge variant="outline" className="overflow-x-scroll scrollbar-hide w-[350px] sm:w-[800px]">Batch {quiz?.batch_Quizz.Batch?.BatchesName}</Badge>

        <div className="flex  items-center gap-6 text-gray-600 dark:text-gray-500">

          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {quiz?.batch_Quizz?.quizz?.quizz_timing}
          </div>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-1 rounded-full ${quiz?.status === "unattempted"
              ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
              }`}
          >
            {quiz?.status}
          </Badge>
        </div>
        <p className="break-all">
          <strong>Course:</strong>   {quiz?.batch_Quizz.quizz?.Course?.course_name}
        </p>
        <p className="break-all">
          <strong>Subject :-</strong> {quiz?.batch_Quizz.quizz?.Course?.Subjects.map((v, i) => (
            <p key={i} className="mb-1">{i + 1}{" "}{v.subject_name}</p>
          ))}
        </p>
      </div>

      <Tabs defaultValue="details" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quiz Details
            </h3>



            {/* Quiz Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-medium">Quiz Name:</span>{" "}
                <span>{quiz?.batch_Quizz?.quizz?.title}</span>
              </div>
              <div>
                <span className="font-medium">Total Questions:</span>{" "}
                <span>{quiz?.batch_Quizz?.quizz?.total_question}</span>
              </div>
              <div>
                <span className="font-medium">Time Period:</span>{" "}
                <span>{quiz?.batch_Quizz?.quizz?.time_period} seconds</span>
              </div>
              <div>
                <span className="font-medium">Total Marks:</span>{" "}
                <span>{quiz?.batch_Quizz?.quizz?.total_marks}</span>
              </div>
              <div>
                <span className="font-medium">Passing Percentage:</span>{" "}
                <Badge variant="secondary">
                  {quiz?.batch_Quizz?.quizz?.passing_percentage}%
                </Badge>
              </div>
            </div>
            {/* Quiz Rules */}
            <div>
              <h4 className="font-medium text-gray-700">Rules:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {quiz?.batch_Quizz?.quizz?.quizz_rules?.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="mt-4">
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quiz Results
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-medium">Obtained Marks:</span>{" "}
                <span>{quiz?.marks_obtained}</span>
              </div>
              <div>
                <span className="font-medium">Percentage:</span>{" "}
                <Badge variant="secondary">{quiz?.marks_percentage}%</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

      </Tabs>
    </Card>
  );
}




