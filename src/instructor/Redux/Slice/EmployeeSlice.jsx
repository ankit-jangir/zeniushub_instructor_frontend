import { createSlice } from "@reduxjs/toolkit";
import { Employee, EmployeeAttendance, EmployeeTask } from "../Api/EmployeeApi";
const EmployeeProfileSlice = createSlice({
  name: "Employee",
  initialState: {
    Employeee: [],
    attendanceData: [],
    Task: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Employee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Employee.fulfilled, (state, action) => {
        state.loading = false;
        state.Employeee = action.payload?.data || [];
      })
      .addCase(Employee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
    builder
      .addCase(EmployeeAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EmployeeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload || [];
      })
      .addCase(EmployeeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
    builder
      .addCase(EmployeeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EmployeeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.Task = action.payload?.data || [];
      })
      .addCase(EmployeeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default EmployeeProfileSlice.reducer;
