import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/instructor/common/header/Header";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import { Disclosure } from "@headlessui/react";
import React from "react";
import { useState } from "react";
import Personal_detals from "./Personal_detals";
import Salary from "./Salary";
import Task from "./Task";
import Attendance from "./Attendance";
import Course from "./Course";

const Profile = () => {
  const [tab, setTab] = useState(1);
  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      {/* Pass setActivePage to Sidebar */}
      <AppSidebar />
      <SidebarInset>
        <Header />
        {/* Main Content Section */}
        <main className="flex-1 overflow-auto">
          <div className="flex flex-1 flex-col gap-4 pt-0">
            <div className="shadow-md shadow-blue-300/30 rounded-lg">
              <Disclosure
                as="nav"
                className="bg-white dark:bg-gray-900 shadow-sm rounded-t-lg"
              >
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="py-4">
                    <div className="grid lg:grid-cols-5 grid-cols-2 md:grid-cols-3 sm:grid-cols-1 gap-x-3 gap-y-3 justify-center">
                      <button
                        onClick={() => setTab(1)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${tab === 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        Personal details
                      </button>
                      <button
                        onClick={() => setTab(2)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${tab === 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        Salary
                      </button>
                      <button
                        onClick={() => setTab(3)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${tab === 3
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        Tasks
                      </button>
                      <button
                        onClick={() => setTab(4)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${tab === 4
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => setTab(5)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${tab === 5
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        Assign Course
                      </button>
                    </div>
                  </div>
                </div>
              </Disclosure>
            </div>

            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              {tab === 1 && <div className="pt-6">{<Personal_detals />}</div>}

              {tab === 2 && <Salary />}

              {tab === 3 && (
                <Task />
              )}
              {tab === 4 && (
                <Attendance />
              )}
              {tab === 5 && (
                <Course />
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profile;
