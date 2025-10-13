import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Header from '@/instructor/common/header/Header'
import AppSidebar from '@/instructor/common/sidebar/Sidebar'
import React from 'react'
import InstructorApp from './InstructorApp2'
// import InstructorApp from './InstructorApp'

const Doubt = () => {
  return (
   <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
       {/* Pass setActivePage to Sidebar */}
       <AppSidebar />
       <SidebarInset>
         <Header />
         {/* Main Content Section */}
         <main className="flex-1 overflow-auto">
           <div className="flex flex-1 flex-col gap-4 pt-0">
             <InstructorApp/>
           </div>
         </main>
       </SidebarInset>
     </SidebarProvider>
  )
}

export default Doubt
