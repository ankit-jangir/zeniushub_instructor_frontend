import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, User } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";

export default function StudentResult({ student, onBack,title }) {
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { results, batches } = useSelector((state) => state.assignments);
    return (

        <Card className="rounded-2xl shadow-xl border dark:border-gray-700 w-full">
            <CardContent className="p-6 space-y-6">
                <button onClick={onBack} className="text-sm cursor-pointer text-blue-600 underline">
                    ← Back
                </button>
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Result Details</h2>
                    <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        Result Declared on {results[0]?.result_declare_date}
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <img
                        src={`${BASE_URL}/viewimagefromazure?filePath=${student?.Student_Enrollment?.Student?.profile_image}`}
                        alt="Student"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{student?.name}</h3>
                        <Button onClick={() => navigate("/student/profile", {
                            state: {
                                from: "assignments",
                                studentId: student?.student_enroll_id
                            }
                        })} variant="link" className="text-blue-600 px-0">View Details</Button>
                    </div>
                </div>

                <p className="text-md text-gray-700 dark:text-gray-200">
                    {title}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Badge variant="outline"><strong>Batch</strong> {" "}<span className="truncate w-[150px]" title={batches[0]?.Batch?.BatchesName}>{batches[0]?.Batch?.BatchesName}</span></Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CalendarIcon className="w-4 h-4" /> {batches[0]?.Assignment?.due_date}
                    </div>
                    <Badge
                        className={`text-sm ${student?.status === "unattempted"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }`}
                    >
                        Status: {student?.status}
                    </Badge>

                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p><strong>Course</strong> : <span className="font-medium">{batches[0]?.Assignment?.Course?.course_name}</span></p>
                    <p><strong>Subject</strong> : <span className="font-medium">{batches[0]?.Assignment?.Subject?.subject_name}</span></p>
                    <p><strong>Total Marks</strong> : <span className="font-medium">{batches[0]?.Assignment?.total_marks}</span></p>
                    <p>Passing Percentage : <span className="text-blue-600 font-medium">{batches[0]?.Assignment?.min_percentage}%</span></p>
                    <p>Question Paper : <Button variant="secondary" size="sm">demo</Button></p>
                </div>

                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Result</h4>
                    <div className="space-y-2 mt-2">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Student’s Response:
                            <input
                                type="text"
                                className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value="demo"
                                disabled
                            />
                        </div>
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            Student’s Score: <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">{student?.marks}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Student’s Percentage: <span className="text-green-600 font-medium">12%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Instructor’s Notes</h4>
                    <textarea
                        className="w-full mt-2 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="Add any instructor notes here..."
                        rows={4}
                    ></textarea>
                </div>
            </CardContent>
        </Card>

    );
}


//  heading , question paper, result, student, Instructor’s 