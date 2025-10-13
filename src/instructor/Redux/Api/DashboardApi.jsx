import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://instructorv2-api-dev.intellix360.in/api/v1";

export const fetchAllTasksForDashboard = createAsyncThunk(
  "tasks/fetchAllForDashboard",
  async (
    { page = 1, limit = 10, status = "", task_tittle = "" },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (status) queryParams.append("status", status);
      if (task_tittle) queryParams.append("task_tittle", task_tittle);

      const url = `${BASE_URL}/exams/getalltaskfordeshbord?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          // Uncomment and use if needed:
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.log("🔥 Catch Error (fetchAllTasksForDashboard):", error);
      return rejectWithValue(error);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/exams/updatestatustask?id=${id}&status=${status}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add auth if required:
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("🔥 Error in updateTaskStatus:", error);
      return rejectWithValue(error);
    }
  }
);
