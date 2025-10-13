import React from "react";
import Assignment from "./instructor/sections/assignments/Assignment";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskDashboard from "./instructor/sections/dashboard/Dashboard";
import "./App.css"
import Batch from "./instructor/sections/batches/Batch";
import ViewDetail from "./instructor/sections/batches/ViewDetail";
import Profile from "./instructor/sections/profile/Profile";
import Exams from "./instructor/sections/exams/Exams";
import CodeLogin from "./instructor/sections/login/CodeLogin";
import EmployeeLogin from "./instructor/sections/login/EmployeeLogin";
import Forgetpassword from "./instructor/sections/login/Forgetpassword";
import StudentProfile from "./instructor/sections/exams/StudentProfile";
import StudentDashboard from "./instructor/sections/assignments/components/StudentProfile";
import Quizz from "./instructor/sections/quizzes/Quizz";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Zoom } from "react-toastify";

import Account from "./instructor/Accounts/Account";
import Received from "./instructor/Accounts/Received";
import Upcoming from "./instructor/Accounts/Upcoming";
import Missed from "./instructor/Accounts/Missed";
import ProtectedRoute from "./instructor/common/Protect_Route";
import Doubt from "./instructor/sections/doubts/Doubt";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CodeLogin />} />
          <Route path="/EmployeeeLogin" element={<EmployeeLogin />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/Forgetpassword" element={<Forgetpassword />} />
            <Route path="/Studentprofile" element={<StudentProfile />} />
            <Route path="/dashboard" element={<TaskDashboard />} />
         
            <Route path="/batches" element={<Batch />} />
            <Route path="/batch/viewdetails/:id" element={<ViewDetail />} />
            <Route path="/assignments" element={<Assignment />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/exam" element={<Exams />} />
            <Route path="/Quizzes" element={<Quizz />} />
            <Route path="/student/profile" element={<StudentDashboard />} />
            <Route path="/accounts" element={<Account />} />
            <Route path="/paid" element={<Received />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/missed" element={<Missed />} />
            <Route path="/Doubt" element={<Doubt />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </div>
  );
};

export default App;
