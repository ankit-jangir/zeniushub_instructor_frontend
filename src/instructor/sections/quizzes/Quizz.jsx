import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/instructor/common/header/Header";
import AppSidebar from "@/instructor/common/sidebar/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ScheduledQuizzes from "./ScheduledQuizzes";
import QuestionBank from "./QuestionBank";
import History from "./History";

const Quizz = () => {

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 h-full">
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <Tabs defaultValue="scheduled" className="w-full space-y-4">

              {/* Tab Header */}
              <div className="px-2 sm:px-4 overflow-x-auto">
                <TabsList className="flex min-w-[500px] sm:min-w-0 sm:flex-nowrap justify-start gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                  <TabsTrigger
                    value="scheduled"
                    className="whitespace-nowrap px-4 py-2 text-sm sm:text-base rounded-sm font-medium text-gray-700 dark:text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    Scheduled Quizzes
                  </TabsTrigger>
                  <TabsTrigger
                    value="questionbank"
                    className="whitespace-nowrap px-4 py-2 text-sm sm:text-base rounded-sm font-medium text-gray-700 dark:text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    Question Bank
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="whitespace-nowrap px-4 py-2 text-sm sm:text-base rounded-sm font-medium text-gray-700 dark:text-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="p-2 sm:p-4 min-h-[75vh]">
                <TabsContent value="scheduled">
                  <ScheduledQuizzes />
                </TabsContent>
                <TabsContent value="questionbank">
                  <QuestionBank />
                </TabsContent>
                <TabsContent value="history">
                  <History />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>

      </SidebarInset>
    </SidebarProvider>
  );
};

export default Quizz;
