import { combineReducers } from "@reduxjs/toolkit";
import examSlice from "./Slice/Exam_slice";
import quizzSliceReducer from "./Slice/Quiz_slice";
import taskReducer from "../Redux/Slice/DashboardSlice";
import assignmentReducer from "./Slice/Assignments_slice";
import BatchReducer from "@/instructor/Redux/Slice/Batch_slice";
import loginSliceReducer from "./Slice/LoginSlice";
import sessionSliceReducer from "./Slice/Session_slice";
import employeeReducer from "./Slice/LogoutEmployeeSlice";
import EmployeeProfileSliceReducer from "./Slice/EmployeeSlice"
import emiSummaryReducer from "./Slice/Account_slice"
import dateFilterReducer from "./Slice/Account_slice";
import employeSalarySliceReducer from "./Slice/Salary";

// import EmployeeProfileSliceReducer from "./Slice/EmployeeSlice";
import CheckTokenReducer from "./Slice/CheckToken";
import categorySliceReducer from "./Slice/Category";



const RootReducer = combineReducers({
  CheckToken: CheckTokenReducer,
  tasks: taskReducer,
  assignments: assignmentReducer,
  exam: examSlice,
  quizzSlice: quizzSliceReducer,
  Batch: BatchReducer,
  Login: loginSliceReducer,
  session: sessionSliceReducer,
  employee: employeeReducer,
  EmployeeProfile: EmployeeProfileSliceReducer,
  emi: emiSummaryReducer,
  dateFilter: dateFilterReducer,
  salary: employeSalarySliceReducer,
  category: categorySliceReducer,
});

export default RootReducer;
