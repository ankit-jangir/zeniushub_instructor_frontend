import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//Employee_Profile
export const Employee = createAsyncThunk(
  "Employee",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/instructor/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

//Employee_Attendance
export const EmployeeAttendance = createAsyncThunk(
  "Employee_Attendance",
  async (
    { token, startDate, endDate, page, limit },
    { rejectWithValue }
  ) => {
    try {
      const url = `${BASE_URL}/api/v1/employee/attendence/attendance?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error?.response?.data || error.message || "Something went wrong"
      );
    }
  }
);


//Employeee_task

export const EmployeeTask = createAsyncThunk(
  "Employee_Task",
  async (token, { rejectWithValue }) => {

    try {
      const url = `${BASE_URL}/api/v1/employee/task/task-status-counts`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
         "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error?.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

