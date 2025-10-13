import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import Header from "@/instructor/common/header/Header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";
const StudentProfile = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const student = location.state?.student;
  const exams = location.state?.exams;
  const formatDateTime = (isoString) => {
    const d = new Date(isoString);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // 01-12
    const day = String(d.getDate()).padStart(2, "0");        // 01-31
    const hours = d.getHours();  // बिना padStart → "7"
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const goBack = () => window.history.back();

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="flex gap-5 mt-2 ms-2">
            <Button
              className="text-white w-[200px] bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2"
              onClick={goBack}
            >
              <ArrowLeft size={18} />
              <span className="text-white">Back to Student</span>
            </Button>
          </div>
          <div className="p-4 sm:p-6 w-full h-full flex flex-col items-center">
            <Card className="w-full max-w-4xl shadow-md border rounded-xl">
              {/* Header with Avatar */}
              <div className="relative w-full h-52 bg-indigo-700 rounded-t-xl flex items-center px-6">
                <div className="ml-32 mt-10 w-full">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg absolute -bottom-12 left-6 cursor-pointer">
                        <AvatarImage
                          className="rounded-full border-4 border-blue-600"
                          src={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${student.Student_Enrollment.Student.profile_image}`}
                          alt={student.Student_Enrollment.Student.name}
                        />
                        <AvatarFallback>{student.Student_Enrollment.Student.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm sm:max-w-md">
                      <img
                        src={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${student.Student_Enrollment.Student.profile_image}`}
                        alt={student.Student_Enrollment.Student.name?.[0]}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </DialogContent>
                  </Dialog>

                  <h2 className="text-2xl font-bold text-white">
                    {student.Student_Enrollment.Student.name}
                  </h2>
                  <p className="text-white text-sm">Student ID: {student.Student_Enrollment.student_id}</p>
                  <p className="text-blue-200 text-xs">
                    Result Declared on {formatDateTime(student.result_dec_date)}


                  </p>

                  {/* More Details Button */}
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/student/profile", {
                        state: {
                          from: "exams",
                          studentId: student?.student_enrollment_id
                        }
                      })}
                    >
                      More Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <CardContent className="mt-20 px-4 sm:px-6 pb-6">
                <p className="text-lg mb-4">{exams.examname}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="px-4 py-1 border rounded-lg text-sm ">
                    <strong>Batch</strong>: {exams.batch_name}
                  </div>
                  <div className="flex items-center text-sm gap-2">
                    <span>🕒  {exams?.start_time || "N/A"}{" "} to {" "}
                      {exams?.end_time || "N/A"}</span>
                    <span>📅  {exams?.schedule_date || "N/A"}</span>
                  </div>
                  <div className="px-4 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    Status: {student.status}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium">Course:</p>
                  <p>{exams.course_name}</p>
                  <p className="font-medium mt-2">Subject:</p>
                  <p>{exams.subject_name}</p>
                </div>

                <div className="mb-6">
                  <p className="font-medium">
                    Total Marks: {exams.total_marks}
                  </p>
                  <p>
                    Passing Percentage:{" "}
                    <span className="text-blue-600 font-semibold">
                      {exams.pass_percent} %
                    </span>
                  </p>
                </div>

                <Separator className="my-4" />

                <h2 className="text-xl font-semibold mb-3">Result</h2>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Student's Score</p>
                    <p className="text-xl font-bold">
                      {student.marks_obtained}/{exams.total_marks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Student's Percentage
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {student.student_percent} %
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <h2 className="text-xl font-semibold mb-2">
                  Instructor's Notes
                </h2>
                <p className="text-gray-500">{student.note}</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudentProfile;
