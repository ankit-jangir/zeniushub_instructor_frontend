import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileTextIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function AssignmentDetails({ setOpenSheet, assignmentdetails, name, img, id, batchName, statusR }) {

    console.log(statusR);

    return (
        <div className="max-w-3xl p-4 space-y-6">
            <div className="flex flex-col sm:flex-row  sm:justify-between items-center gap-2 sm:gap-0 mt-4">
                <div>
                    <h1 className="text-2xl font-bold">Assignment Details</h1>
                    <p className="text-sm text-muted-foreground">Full report of student's assignment submission</p>
                </div>
                {statusR.status !== "Pending" && (<Badge className="bg-green-100 dark:bg-green-200 text-green-700 dark:text-green-950 text-sm px-3 py-1">
                    Result Declared on {assignmentdetails?.result_declare_date}
                </Badge>)}
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 border border-gray-400">
                            <AvatarImage className="w-full h-full" src={`${BASE_URL}/viewimagefromazure?filePath=${img}`} />
                            <AvatarFallback>{name?.at(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold truncate w-[230px] sm:w-[400px]" title={name}>{name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Student ID: {id}</p>
                            <Button onClick={() => setOpenSheet(false)} variant="link" className="px-0 text-blue-600 text-sm">
                                View Profile
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div><strong>Batch:</strong>{" "}<span className="truncate w-[100px] sm:w-[230px] inline-block align-bottom" title={batchName}> {batchName}</span></div>
                        <div className="flex items-center gap-1"><ClockIcon size={16} />
                            {assignmentdetails?.BatchAssignment?.Assignment?.due_date}</div>
                    </div>

                    <div className="mt-4 space-y-1">
                        <p><strong>Course:</strong> {assignmentdetails?.BatchAssignment?.Assignment?.Course?.course_name}</p>
                        <p><strong>Subject:</strong> {assignmentdetails?.BatchAssignment?.Assignment?.Subject?.subject_name}</p>
                        <p><strong>Marks:</strong>        {assignmentdetails?.BatchAssignment?.Assignment?.total_marks}</p>
                        <p><strong>Passing Percentage:</strong> <span className="text-green-600">       {assignmentdetails?.BatchAssignment?.Assignment?.min_percentage}%</span></p>
                        <Badge className={`${statusR.status === "Pass"
                            ? "bg-green-100 dark:bg-green-200 text-green-700 dark:text-green-950"
                            : statusR.status === "Fail"
                                ? "bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-950"
                                : "bg-yellow-100 dark:bg-yellow-200 text-yellow-700 dark:text-yellow-950"
                            }`}>Status: {statusR?.status}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-medium ">Instructor's Attachments</h3>

                    <Button variant="outline" className="justify-start "> <FileTextIcon className="w-4 h-4 mr-2" />
                        {assignmentdetails?.BatchAssignment?.Assignment?.attachments ? (
                            <a
                                href={`${BASE_URL}/viewimagefromazure?filePath=${assignmentdetails?.BatchAssignment?.Assignment?.attachments}`}
                                target="_blank" title={assignmentdetails?.BatchAssignment?.Assignment?.attachments}
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 hover:underline truncate w-[150px]"
                            >
                                {assignmentdetails?.BatchAssignment?.Assignment?.attachments}
                            </a>
                        ) : (
                            "No attachment"
                        )}
                    </Button>



                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-medium">Result</h3>
                    <div>
                        <p className="text-sm font-medium">Student's Attachments</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            <TooltipProvider>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="justify-start truncate w-full">
                                            <FileTextIcon className="w-4 h-4 mr-2" />
                                            {assignmentdetails?.attachments ? (
                                                <a
                                                    href={`${BASE_URL}/viewimagefromazure?filePath=${assignmentdetails?.attachments}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-blue-600 hover:underline truncate w-[150px]"
                                                >
                                                    {assignmentdetails?.attachments}
                                                </a>
                                            ) : (
                                                "No attachment"
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {assignmentdetails?.attachments ? assignmentdetails?.attachments : "No attachment"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="flex items-start  space-x-4 mt-4">
                        <div>
                            <p className="text-sm font-medium">Student's Score</p>
                            <p className="border rounded px-3 py-1 inline-block">{assignmentdetails?.obtained_marks || "--"}/ {assignmentdetails?.BatchAssignment?.Assignment?.total_marks}</p>
                        </div>
                        <div className="ms-12">
                            <p className="text-sm font-medium">Student's Percentage</p>
                            <p className={
                                statusR.percentage >= assignmentdetails?.BatchAssignment?.Assignment?.min_percentage
                                    ? "text-green-600 font-semibold"
                                    : statusR.percentage === null
                                        ? "text-gray-600 font-semibold"
                                        : "text-red-600 font-semibold"
                            }>{statusR.percentage || "--"}%</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-md font-semibold">Instructor's Notes</h4>
                        <p className="text-sm  sm:w-[650px] text-muted-foreground mt-1">
                            {assignmentdetails?.note ? assignmentdetails?.note : "No note"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}



//  pass or fail or pending count base page