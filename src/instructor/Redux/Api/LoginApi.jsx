import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const loginEmployee = createAsyncThunk(
  "Employee/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/instructor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Return entire error object to the rejected action
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Network error. Please try again.",
      });
    }
  }
);

export default loginEmployee;
