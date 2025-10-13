import React from 'react';
import AppSidebar from '../common/sidebar/Sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Header from '../common/header/Header';

import Students from './Student';

const Account = () => {


    return (
        <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
            <AppSidebar />
            <SidebarInset>
                <Header />
                <main className="min-h-screen w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                    {/* Header Card */}
                    <div className="w-full bg-white dark:bg-gray-900 shadow-md dark:shadow-blue-300/30 rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between px-6 py-5 mb-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <button
                                className="rounded-lg px-6 py-2 text-base font-semibold bg-blue-600 text-white hover:bg-blue-500 transition duration-200"
                            >
                                 Students Account
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 border dark:shadow-blue-300/30 border-gray-200 dark:border-gray-700">
                        <Students />
                    </div>
                </main>

            </SidebarInset>
        </SidebarProvider>
    );
};

export default Account;

