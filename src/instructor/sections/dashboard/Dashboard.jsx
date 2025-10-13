import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import Header from "@/instructor/common/header/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  fetchAllTasksForDashboard,
  updateTaskStatus,
} from "@/instructor/Redux/Api/DashboardApi";
import { Badge } from "../../../components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";

export default function TaskDashboard() {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  console.log(tasks, "dgf bbhd bb ");

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [localStatusMap, setLocalStatusMap] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const tasksPerPage = 10;




  const fetchAllTasksForDashboardsss = async () => {

    await tryCatchWrapper(() =>

      dispatch(
        fetchAllTasksForDashboard({
          page: currentPage,
          limit: tasksPerPage,
          status: selectedStatus,
          task_tittle: searchTerm.trim(),
        })
      ).unwrap())

  };

  useEffect(() => {

    fetchAllTasksForDashboardsss();
  }, [dispatch, currentPage, selectedStatus, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchTerm]);

  const taskList = Array.isArray(tasks?.tasks?.data) ? tasks.tasks?.data : [];
  const totalPages = tasks?.tasks?.totalPages || 1;

  const filteredTasks = taskList.filter((task) => {
    const matchStatus =
      selectedStatus === null || task.status === selectedStatus;
    const matchSearch = task.task_tittle
      ? task.task_tittle.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return matchStatus && matchSearch;
  });

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    setIsUpdating(true);
    try {
      toast.dismiss();
      await dispatch(
        updateTaskStatus({ id: taskId, status: newStatus })
      ).unwrap();
      dispatch(
        fetchAllTasksForDashboard({ page: currentPage, limit: tasksPerPage })
      );
      setLocalStatusMap((prev) => {
        const newMap = { ...prev };
        delete newMap[taskId];
        return newMap;
      });
      toast.success("Task status updated successfully!", {
        toastId: taskId,
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      toast.error(
        `Failed to update task status: ${err.message || "Unknown error"}`,
        {
          toastId: `error-${taskId}`,
        }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <ToastContainer
            key="toast-container"
            position="top-right"
            autoClose={1000}
            limit={1}
            newestOnTop
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
          <div className="p-6 space-y-6 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-gray-800 min-h-screen">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {["not started", "completed", "ongoing", "not completed"].map(
                (label, i) => {
                  const count = tasks?.tasks?.statusCounts?.[label] || 0;
                  const colorMap = {
                    "not started": {
                      bg: "from-blue-100 to-white dark:from-blue-900 dark:to-gray-800",
                      text: "text-blue-700 dark:text-blue-300",
                      border: "border-blue-300",
                      value: "not started",
                    },
                    completed: {
                      bg: "from-green-100 to-white dark:from-green-900 dark:to-gray-800",
                      text: "text-green-700 dark:text-green-300",
                      border: "border-green-300",
                      value: "completed",
                    },
                    ongoing: {
                      bg: "from-yellow-100 to-white dark:from-yellow-900 dark:to-gray-800",
                      text: "text-yellow-700 dark:text-yellow-300",
                      border: "border-yellow-300",
                      value: "ongoing",
                    },
                    "not completed": {
                      bg: "from-red-100 to-white dark:from-red-900 dark:to-gray-800",
                      text: "text-red-700 dark:text-red-300",
                      border: "border-red-300",
                      value: "not completed",
                    },
                  };
                  const { bg, text, border, value } = colorMap[label];

                  return (
                    <Card
                      key={i}
                      onClick={() => setSelectedStatus(value)}
                      className={`cursor-pointer bg-gradient-to-r ${bg} ${border} shadow dark:shadow-lg`}
                    >
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {label}
                        </p>
                        <p className={`text-2xl font-bold ${text}`}>{count}</p>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 dark:bg-gray-900 dark:text-white"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* <Button
                onClick={() => setSelectedStatus(null)}
                className="bg-blue-800 hover:bg-blue-900 text-white"
              >
                Show All Tasks
              </Button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2 overflow-auto rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow dark:shadow-md">
                {loading ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    Loading tasks...
                  </div>
                ) : taskList.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No data found.
                  </div>
                ) : (
                  <>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr className="text-left">
                          <th className="p-4 font-medium text-gray-700 dark:text-gray-300">
                            Task Name
                          </th>
                          <th className="p-4 font-medium text-gray-700 dark:text-gray-300">
                            Due Date
                          </th>
                          <th className="p-4 font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </th>
                          <th className="p-4 font-medium text-gray-700 dark:text-gray-300">
                            Assignee
                          </th>
                          <th className="p-4 font-medium text-gray-700 dark:text-gray-300 ms-10">
                            View Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task, index) => (
                          <tr
                            key={index}
                            className="border-t dark:border-gray-700"
                          >
                            <td className="p-4">
                              <p className="font-medium text-blue-900 dark:text-blue-300 truncate w-[180px]" title={task.task_tittle}>
                                {task.task_tittle || "N/A"}
                              </p>
                              <p className="text-gray-500 text-xs dark:text-gray-400 truncate w-[190px]" title={task.description}>
                                {task.description || "No description"}
                              </p>
                            </td>
                            <td className="p-4 dark:text-gray-200">
                              {task.due_date || "N/A"}
                            </td>
                            <td className="p-4">
                              <Badge
                                className={
                                  task.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : task.status === "ongoing"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      : task.status === "not started"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : task.status === "not completed"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                }
                              >
                                {task.status || "Unknown"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {task.Admin?.full_name || "N/A"}
                            </td>
                            <td className="p-4 text-center">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button className="bg-blue-600 hover:bg-blue-700 w-full px-4 text-white">
                                    View Details
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="border-l w-full max-w-md p-6 overflow-y-auto scrollbar-thin">
                                  <SheetHeader>
                                    <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-4 flex items-center space-x-3">
                                      <FileText className="w-7 h-7 text-blue-600" />
                                      <span>Task Details</span>
                                    </SheetTitle>
                                  </SheetHeader>
                                  <div className="mt-8 space-y-6 text-gray-800 dark:text-gray-200">
                                    <div className="bg-White dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                                      <p className="text-xl font-semibold text-blue-600">
                                        {task.task_tittle}
                                      </p>
                                      <p className="mt-2 text-sm">
                                        {task.description}
                                      </p>
                                    </div>
                                    <div className="bg-White dark:bg-gray-800 border rounded-lg p-4 shadow-sm space-y-4">
                                      <p>
                                        <strong>🗓 Due Date:</strong>{" "}
                                        {task.due_date || "N/A"}
                                      </p>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          📌 Status:
                                        </label>
                                        <select
                                          value={
                                            localStatusMap[task.id] ??
                                            task.status
                                          }
                                          onChange={(e) =>
                                            setLocalStatusMap((prev) => ({
                                              ...prev,
                                              [task.id]: e.target.value,
                                            }))
                                          }
                                          className="w-full px-3 py-2 border rounded-md bg-White dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                                          disabled={isUpdating}
                                        >
                                          <option value="not started">
                                            Not Started
                                          </option>
                                          <option value="ongoing">
                                            Ongoing
                                          </option>
                                          <option value="completed">
                                            Completed
                                          </option>
                                          <option value="not completed">
                                            Not Completed
                                          </option>
                                        </select>
                                        <Button
                                          className="mt-3 bg-green-600 hover:bg-green-700 text-white w-full"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              task.id,
                                              localStatusMap[task.id] ??
                                              task.status
                                            )
                                          }
                                          disabled={isUpdating}
                                        >
                                          {isUpdating ? "Saving..." : "Save"}
                                        </Button>
                                      </div>
                                      <p>
                                        <strong>👤 Assignee:</strong>{" "}
                                        {task.Admin?.full_name || "N/A"}
                                      </p>
                                      <div>
                                        <p className="font-semibold text-indigo-600 mb-1">
                                          📎 Attachments :-
                                        </p>
                                        {task?.attachments ? <a
                                          href={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${task?.attachments}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:text-blue-500"
                                        >
                                          {task?.attachments}
                                        </a> : <p className="text-gray-500 dark:text-gray-400 italic">
                                          No attachments available.
                                        </p>}
                                      </div>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between p-3 border-t dark:border-gray-700">
                      <Button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 ${currentPage === 1
                          ? "bg-blue-200 text-blue-600 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>
                      <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 ${currentPage === totalPages
                          ? "bg-blue-200 text-blue-600 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
